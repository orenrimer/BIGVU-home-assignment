# BIGVU-home-assignment

A serverless application that receives a website URL, takes a screenshot of the given website and creates a 10-second mp4 video with no sound displaying that screenshot. The app will store the created file locally and  return its url.
\
\
In addition, I have also uploaded the output file into an Amazon S3 bucket.
## Install
Run the following command inside the project folder to install all the dependencies:
```shell
npm install
```

## Usage
Run the following command to start the app locally:
```shell
serverless offline start 
```
or
```shell
sls offline start 
```
while the server is running send a POST request to http://localhost:3000/dev/ with the desired URL. the payload should look like that:
``` js
{
  url: "website url"
}
```
expected output:
``` js
{
  file: "path/to/file/video.mp4"
}
```
## Design
![Capture](https://user-images.githubusercontent.com/76216721/221379701-5965c30c-47a4-4626-b891-5a5b1d9a5bbf.PNG)
