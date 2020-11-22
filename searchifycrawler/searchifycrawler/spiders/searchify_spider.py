import datetime
import time

import scrapy
import lyricsgenius
import urllib.request
from scrapy.spiders import Rule
from scrapy.linkextractors import LinkExtractor

from searchifycrawler.items import SearchifycrawlerSong, SearchifycrawlerPlaylist,SearchifycrawlerArtist


class SearchifySpider(scrapy.spiders.CrawlSpider):
    name = "searchifySpider"
    url_spotify = 'https://open.spotify.com'
    allowed_domains = ['open.spotify.com']
    start_urls = [
        'https://open.spotify.com/album/5lJqux7orBlA1QzyiBGti1',
        'https://open.spotify.com/artist/0EFisYRi20PTADoJrifHrz',
        'https://open.spotify.com/album/1V9QpD8kjA2iHCElhFGvlo',
        'https://open.spotify.com/artist/64aJYyrXljOodnUG6jvhRD',
        'https://open.spotify.com/playlist/37i9dQZF1DX2EiUAL7Wdfc',
        'https://open.spotify.com/artist/2x7PC78TmgqpEIjaGAZ0Oz',
        'https://open.spotify.com/artist/716NhGYqD1jl2wI1Qkgq36',
        'https://open.spotify.com/album/16ZMrJHpIg8yz4We1xuvuu',
        'https://open.spotify.com/playlist/37i9dQZF1DX1HCSfq0nSal',
        'https://open.spotify.com/artist/2R21vXR83lH98kGeO99Y66',
        'https://open.spotify.com/artist/47MpMsUfWtgyIIBEFOr4FE',
        'https://open.spotify.com/album/46xbsFOp9g1WqTidQEs7YT',
        'https://open.spotify.com/album/2m9Vuc9Q19qhSm6RQmBgsR',
        'https://open.spotify.com/genre/latin-page',
        'https://open.spotify.com/genre/latin_urban_page-page',
        'https://open.spotify.com/playlist/37i9dQZEVXbNFJfN1Vw8d9',
        'https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF'
    ]

    rules = (
        Rule(LinkExtractor(), callback='parse_item', follow=True),
    )

    custom_settings = {
        'REDIRECT_MAX_TIMES': 20
    }

    song_url = '/album'
    artist_url = '/artist'
    playlist_url = '/playlist'

    genius = lyricsgenius.Genius("SlmvN3xR5PNvMuepTwncmBRB2t5BsLCW3ZjMdBjKmavw-yoenkzNrQbnjbbrrWR4")

    def parse_item(self, response):

        item_url_list = response.xpath('//a/@href').extract()
        for item_url in item_url_list:
            if item_url.startswith(self.song_url):
                absolute_url = self.url_spotify + item_url
                yield scrapy.Request(absolute_url, callback=self.song)
            elif item_url.startswith(self.playlist_url):
                absolute_url = self.url_spotify + item_url
                yield scrapy.Request(absolute_url, callback=self.playlist)
            elif item_url.startswith(self.artist_url):
                absolute_url = self.url_spotify + item_url
                yield scrapy.Request(absolute_url, callback=self.artist)

    def song(self, response):

        song = SearchifycrawlerSong()
        song['song_url'] = response.url
        song['song_name'] = response.css('.track-name::text').extract()
        song['song_artist'] = response.css('.media-bd').xpath("//h2/a/text()").extract_first()
        song['song_duration'] = response.css('.total-duration::text').extract()
        song['song_album_name'] = response.css('.media-bd').xpath("//h1/span/text()").extract_first()
        song['song_album_year'] = int(response.css('.entity-additional-info::text').extract_first().split(" ")[0])

        artist_link = response.css('.media-bd').xpath("//h2/a/@href").extract_first()
        try:
            link = self.url_spotify + artist_link
            yield scrapy.Request(link, callback=self.song_phase2, cb_kwargs=dict(song=song))
        except:
            print('Can´t get song artist link')


    def song_phase2(self, response, song):

        insights = response.css('.insights__column__number::text').extract()

        song['song_artist_followers'] = int(insights[0].replace(',', ''))
        song['song_artist_listeners'] = int(insights[1].replace(',', ''))

        i = 0
        while i < len(song['song_name']):
            resultSong = SearchifycrawlerSong()
            resultSong['song_url'] = song['song_url']
            resultSong['song_name'] = song['song_name'][i]
            resultSong['song_artist'] = song['song_artist']
            resultSong['song_artist_followers'] = song['song_artist_followers']
            resultSong['song_artist_listeners'] = song['song_artist_listeners']
            x = time.strptime(song['song_duration'][i].split(',')[0], '%M:%S')
            seconds = datetime.timedelta(hours=x.tm_hour, minutes=x.tm_min, seconds=x.tm_sec).total_seconds()
            resultSong['song_duration'] = seconds
            resultSong['song_album_name'] = song['song_album_name']
            resultSong['song_album_year'] = song['song_album_year']

            try:
                geniusSong = self.genius.search_song(song['song_name'][i], song['song_artist'])
                resultSong['song_lyrics'] = geniusSong.lyrics.replace("\n", "\\n")
            except:
                resultSong['song_lyrics'] = ""

            i += 1

            yield resultSong


    def playlist(self, response):

        file = SearchifycrawlerPlaylist()
        file['playlist_url'] = response.url
        file['playlist_name'] = response.css('.media-bd').xpath("//h1/span/text()").extract_first()
        file['playlist_songs'] = response.css('.track-name::text').extract()
        file['playlist_artists_albums'] = response.xpath("//a/span/text()").extract()
        file['playlist_songs_number'] = response.css('.entity-additional-info::text').extract_first().split(" ")[0]
        file['playlist_similar'] = response.css('.more-by-grid').xpath("//li/a/div/span/text()").extract()


        yield file

    def artist(self, response):

        file = SearchifycrawlerArtist()
        file['artist_url'] = response.url
        file['artist_name'] = response.css('.view-header::text').extract_first()

        insights = response.css('.insights__column__number::text').extract()
        file['artist_followers'] = int(insights[0].replace(',', ''))
        file['artist_listeners'] = int(insights[1].replace(',', ''))

        parsed_locations = []
        locations = response.css('.horizontal-list__item__title::text').extract()
        for l in locations:
            parsed_locations.append(l[-2:])
        file['artist_locations'] = parsed_locations

        yield file