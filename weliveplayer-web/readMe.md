License command
mvn license:format -Drun-license=true -P license

todo



make cache at server. or leave it just have direct calls.
protected with token.
getApplications() by city
getMyProfiles() another api
getComments()
getRecommendedApps()
server to server basicAuth using key in properties.

no login but a filter with AAC library, check permission that token is valid.
access token on client side must be checked. (w.r.t time). APi never knows about client
must be developed in a way that it check that access_token is valid. Take the user from BasicProfile
get Id to be used for external profile call.

check the API call on POSTMAN w.r.t header acces_token(need to read it in filter and validate)??