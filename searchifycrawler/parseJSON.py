#Write line above every json format prod to get valid Elasticsearch bulk load file
with open("items.json", "r", encoding='utf8') as in_file:
    buf = in_file.readlines()

count=1
with open("../searchify/api/data/elasticitems.json", "w", encoding='utf8') as out_file:
    for line in buf:
        index = '"artists"'
        if (line.startswith('{"song_url')):
            index = '"songs"'
        elif(line.startswith('{"playlist_url')):
            index = '"playlists"'
        bulkdata = '{"index":{"_index":' + index + ',"_id":"'
        scount = str(count)
        bulkdata = bulkdata + scount + '"}}\n'
        out_file.write(bulkdata)
        out_file.write(line)
        count = count+1