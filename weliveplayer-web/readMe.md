WeLivePlayer Web API Server.
This file contains the basic documentation for the build and testing process of the WeLivePlayer Web API Server.
The server acts as intermediary between weliveplayer mobile client and weliveplayer REST API server. The application
provide control over the data required by client. It makes additional REST calls in PRE and POST stages of operations to
match requirement and to ensure data consistency. The application help improves security by validating access token from 
client and improves the performance of access by maintaining internal cache.
Requirements
The project has the following requirements that must be correctly installed and configured:
Java SE Development Kit 7. Available at http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html
Maven 3. Available at http://maven.apache.org/
ApacheTomcat 7.0. Available at https://tomcat.apache.org/download-70.cgi
[Note: set CATALINA_HOME variable to ApacheTomcat root]
Installation
First, clone the following repository somewhere in file system.
git clone <https://github.com/smartcommunitylab/welive.player/tree/master/weliveplayer-web>
and create web application archive (war) by executing the following command from the root directory
mvn clean install -Dmaven.test.skip=true -fae
Start server
First, copy from target/ directory the war file in to the web application folder of Apache Tomcat Server. Start server by running from $CATALINA_HOME
bin\startup

Testing the server
The server can be tested using REST API clients (POSTMAN in GoogleChrome or Curl)

The REST methods are described below

1. Title: Get Applications By City and Type.
   Url: /api/apps/{pilotId}/{appType}
   Method: GET
   Header: Authorization= Bearer <ACCESS_TOKEN>, example Authorization: Bearer 4155f2a3-e1ab-44b3-a7f0-7f292faa7a57
   Path Variables:
   Required pilotId=[String], example (/Trento, /Bilbao, /Novisad, /All)
   Required appType=[String], example (/BuildingBlock, /Dataset, /All)
   Url Params: 
   Optional start=[Integer], example start=0 (pagination page)
   Optional count=[Integer], example count=20 (number of apps per page)
   SuccessResponse:
   {
	"data": [{
		"id": "100",
		"description": "Traffic in City fo Novi Sad",
		"linkImage": null,
		"eId": "",
		"name": "Traffic",
		"city": "All",
		"interfaceOperation": "http://services.nsinfo.co.rs/WeLive/odata/Traffic",
		"rating": 0,
		"type": "RESTful Web Service",
		"typeId": 4,
		"comments": [],
		"recommendation": null,
		"tags": null
	},
	..{
		"id": "62",
		"description": "This dataset allows the consumer to have a complete view about the scheduling of the street washing day by day in the Trento city.",
		"linkImage": "https://dev.welive.eu/documents/10181/ba79e932-9b3a-4134-b0e6-b112d3660e07",
		"eId": "",
		"name": "StreetWashing",
		"city": "All",
		"interfaceOperation": "http://www.testservice.com/testservice/services/testservice?wsdl",
		"rating": 3,
		"type": "Dataset",
		"typeId": 101,
		"comments": [{
			"comment": "Very useful!",
			"authorNode": "83",
			"publishDate": "2015-10-20 18:30:24.609",
			"rating": 0
		}],
		"recommendation": null,
		"tags": null
	}],
	"errorMessage": null,
	"errorCode": 0
   }
  ErrorResponse:
  SampleCall: http://localhost:8080/weliveplayer/api/apps/All/All?start=0&count=20
  
   
  
2. Title: Read User Profile Using ACCESS_TOKEN.
   Url: /api/userProfile
   Method: GET
   Header: Authorization= Bearer <ACCESS_TOKEN>, example Authorization: Bearer 4155f2a3-e1ab-44b3-a7f0-7f292faa7a57
   SuccessResponse: 
   {
    "data": {
        "ccUserID": "0",
        "name": "WeLive",
        "surname": "Tools",
        "gender": "Male",
        "birthdate": "null",
        "address": "Italy",
        "city": "Palermo",
        "country": "Italy",
        "zipCode": "null",
        "email": "welive@welive.eu",
        "languages": [
            "Italian",
            "Spanish",
            "Serbian",
            "Finnish"
        ],
        "skills": [],
        "usedApps": [],
        "profileData": {
            "numCreatedIdeas": 0,
            "reputationScore": 0,
            "numCollaborationsInIdeas": 0
        },
        "lastKnownLocation": {
            "lng": null,
            "lat": null
        },
        "thirdParties": [],
        "developer": true
    },
    "errorMessage": null,
    "errorCode": 0
	}
	ErrorResponse:
    SampleCall: http://localhost:8080/weliveplayer/api/userProfile


3. Title: Get Single Application Comments.
   Url: api/appComments/{artifactId}
   Method: GET
   Header: Authorization= Bearer <ACCESS_TOKEN>, example Authorization: Bearer 4155f2a3-e1ab-44b3-a7f0-7f292faa7a57
   Path Variables:
   Required artifactId=[String], example (/61, /71)
   Url Params: 
   Optional start=[Integer], example start=0 (pagination page)
   Optional count=[Integer], example count=20 (number of comments per page)
   SuccessResponse:
   {
    "data": [
        {
            "comment": "Very useful!",
            "authorNode": "83",
            "publishDate": "Tue Oct 20 18:30:24 GMT 2015",
            "rating": 0
        }
    ],
    "errorMessage": null,
    "errorCode": 0
   }
   ErrorResponse:
   SampleCall: http://localhost:8080/weliveplayer/api/appComments/62?start=0&count=20
