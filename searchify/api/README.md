# Searchify

## Requirements

- Node 12.14.0+.
- Yarn 1.21.1+.
- Docker 19.03.13+
- Docker Compose 1.27.4+
- Python 3.8+

## Run

```
python -m pip install virtualenv
python -m venv ./env
python -m pip install -r requirements.txt
```

## Crawling

```
cd searchifycrawler
python -m scrapy crawl searchifySpider
(ALTERNATIVAMENTE) scrapy crawl searchifySpider
(OPCIONAL) ctrl+c para la ejecución del spider a voluntad, si no se quiere llegar al máximo de páginas recorridas.
python parseJSON.py
```

## Cluster set-up
```
cd ../searchify/api
wsl -d docker-desktop
	sysctl -w vm.max_map_count=262144
	exit
docker-compose up --build
```
## Indexing
En otro terminal, en el directorio Searchify/searchifycrawler/api

```
python ./src/index/createIndex.py
```

## Frontend
```
cd ../frontend
yarn install (only first time to download libraries)
yarn start
```
