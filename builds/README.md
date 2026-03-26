docker build \
    -t ghcr.io/syncuprockslive/bandguy-frontend-react:v0.0.5 \
    -t ghcr.io/syncuprockslive/bandguy-frontend-react:latest \
    -f builds/frontend/Dockerfile .

docker run -it --rm -p 8080:9000 ghcr.io/syncuprockslive/bandguy-frontend-react:latest

export CR_PAT=YOUR_TOKEN
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

docker push ghcr.io/syncuprockslive/bandguy-frontend-react --all-tags
