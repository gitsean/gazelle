.PHONY : build start clean

build:
	python -m pip install -r ./server/requirements.txt
	npm install --prefix ./client/
	npm run build --prefix ./client/
	npm install -g http-server
	
start:
	cd server; python app.py & cd ..; cd client; http-server dist

clean:
	kill -9 `lsof -t -i:5000`
	kill -9 `lsof -t -i:8080`
