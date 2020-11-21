# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class SearchifycrawlerSong(scrapy.Item):
    song_url = scrapy.Field()
    song_name = scrapy.Field()
    song_artist = scrapy.Field()
    song_artist_followers = scrapy.Field()
    song_artist_listeners = scrapy.Field()
    song_duration = scrapy.Field()
    song_album_name = scrapy.Field()
    song_album_year = scrapy.Field()
    song_lyrics = scrapy.Field()

class SearchifycrawlerPlaylist(scrapy.Item):
    playlist_url = scrapy.Field()
    playlist_name = scrapy.Field()
    playlist_songs = scrapy.Field()
    playlist_artists_albums = scrapy.Field()
    playlist_songs_number = scrapy.Field()
    playlist_similar = scrapy.Field()


class SearchifycrawlerArtist(scrapy.Item):
    artist_url = scrapy.Field()
    artist_name = scrapy.Field()
    artist_followers = scrapy.Field()
    artist_listeners = scrapy.Field()
    artist_locations = scrapy.Field()