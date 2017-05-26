
1. issue with startapp plugin.
cordova.define("org.apache.cordova.startapp.startapp", function (require, exports, module) { *
it appeared that factory download of this plugin comes with * to be fixed and moved inside the comment.

2. issue with googleplus plugin
https://github.com/EddyVerbruggen/cordova-plugin-googleplus
https://github.com/EddyVerbruggen/cordova-plugin-googleplus/issues/300
We are using [cordova-plugin-googleplus 5.1.1 "Google SignIn"] inside ionic framework application and encountered the same issue.
For us it worked, after locally modifying the GooglePlus.java class by wrapping the calls to signout(), trySilentLogin(), disconnect() methods inside an AsyncTask as shown below.

Line95 (GooglePlus.java)

else if (ACTION_TRY_SILENT_LOGIN.equals(action)) {
            //pass args into api client build
            buildGoogleApiClient(args.optJSONObject(0));

            Log.i(TAG, "Trying to do silent login!");

             new AsyncTask<String, String, String>() {
                @Override
                protected String doInBackground(String... params) {
                     trySilentLogin();
                     return null;
                }
             }.execute();
            // trySilentLogin();

        } else if (ACTION_LOGOUT.equals(action)) {
            Log.i(TAG, "Trying to logout!");
            
            new AsyncTask<String, String, String>() {
                @Override
                protected String doInBackground(String... params) {
                     signOut();
                     return null;
                }
             }.execute();
            
            //signOut();

        } else if (ACTION_DISCONNECT.equals(action)) {
            Log.i(TAG, "Trying to disconnect the user");
             new AsyncTask<String, String, String>() {
                @Override
                protected String doInBackground(String... params) {
                     disconnect();
                     return null;
                }
             }.execute();
            // disconnect();

        } 
