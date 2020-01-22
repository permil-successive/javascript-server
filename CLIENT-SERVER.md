# Terms

## Client
A client is a device or software that make request any service (resource) to the server. Generally client has low resources as compare to server like RAM, CPU, Storage.
eg. Requesting a webpage from server. [more info](https://en.wikipedia.org/wiki/Client_(computing))

## Server
A server is hardware machine that provide resources to client as per their request. Servers in 24 hours and having great resources like RAM, CPU, Storage. Server generally share its resources. In HTTP request, server serve HTTP pages. eg.  Database Server, Web Server, Email Server. [more info](https://en.wikipedia.org/wiki/Server_(computing))

#
# Client - Server Model
In this model, a client request the resources from the server and server provide it over the network.

In case of any application need more computation power than a client device having in it then client request the server to process the data.

eg. RMI in java.
[more info](https://en.wikipedia.org/wiki/Client%E2%80%93server_model)

# How a HTTP request get served
In web-browser of client device eg. Google Chrome, There are the following process is done when we load a web-page.

1. web broswer validates the URL.
2. checks for internet connection.
3. **DNS resolve**
4. A **HTTP request** is made to the server. Components of HTTP request are
    * HTTP header and version
    * Request Url
    * Request Cookies
    * Url Request Parameters
5. In server, There are few components
    * Database
    * App Server
    * Web Server
6. The request is received on Web server.
7. The server pass request to App server after validating the request.
8. App server having business logic and retrive data from database if required and serve the data.
9. The response is sent to client. Response include
    * HTTP Version
    * Server details
    * Cache timeout
    * Reponse data
    * and many more.

In case App server take a long time in responding then web-server can response **Timeout** message.
