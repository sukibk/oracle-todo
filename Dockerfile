FROM ubuntu:latest
LABEL authors="markosudar"

ENTRYPOINT ["top", "-b"]