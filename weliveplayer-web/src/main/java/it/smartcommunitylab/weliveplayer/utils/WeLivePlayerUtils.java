package it.smartcommunitylab.weliveplayer.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;
import java.util.Date;

import javax.net.ssl.HttpsURLConnection;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class WeLivePlayerUtils {

	/** USER AGENT. **/
	private String USER_AGENT = "Mozilla/5.0";
	/** HTTP Client. **/
	private HttpClient httpClient = new HttpClient(new MultiThreadedHttpConnectionManager());
	/** Logging Authorization. **/
	public static String loggingAuth = "Bearer da44df79-2168-4d6d-82fe-52a0cc2f3e22";
	@Autowired
	private Environment env;

	/** constants. **/
	public static final String ERROR_CODE = "errorCode";
	public static final String ERROR_MSG = "errorMsg";

	public static int getDayOfMonth(Date reqDate) {
		int day = -1;
		Calendar cal = Calendar.getInstance();
		cal.setTime(reqDate);
		day = cal.get(Calendar.DAY_OF_MONTH);
		return day;
	}

	public static int getMonthOfYear(Date reqDate) {
		int month = -1;
		Calendar cal = Calendar.getInstance();
		cal.setTime(reqDate);
		month = cal.get(Calendar.MONTH) + 1;
		return month;
	}

	public static int getYear(Date reqDate) {
		int year = -1;
		Calendar cal = Calendar.getInstance();
		cal.setTime(reqDate);
		year = cal.get(Calendar.YEAR);
		return year;
	}

	/**
	 * Http GET.
	 * 
	 * @param url
	 * @param contentType
	 * @param accept
	 * @param auth
	 * @param secure
	 * @return
	 * @throws Exception
	 */
	public String sendGET(String url, String contentType, String accept, String auth, int readTimeout)
			throws Exception {

		URL obj = new URL(url);
		StringBuffer response = new StringBuffer();
		boolean secure = false;
		if (url.toLowerCase().startsWith("https://")) {
			secure = true;
		}
		// HTTPS.
		if (secure) {
			HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
			// optional default is GET
			con.setRequestMethod("GET");
			// read timeout.
			if (readTimeout != -1) {
				con.setReadTimeout(readTimeout);
			}
			// add request header
			con.setRequestProperty("User-Agent", this.USER_AGENT);
			if (accept != null && !(accept.isEmpty())) {
				con.setRequestProperty("Accept", accept);
			}
			if (contentType != null && !(contentType.isEmpty())) {
				con.setRequestProperty("Content-Type", contentType);
			}
			if (auth != null && !(auth.isEmpty())) {
				con.setRequestProperty("Authorization", auth);
			}
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
			String inputLine;
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
		} else {
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			// optional default is GET
			con.setRequestMethod("GET");
			// read timeout.
			if (readTimeout != -1) {
				con.setReadTimeout(readTimeout);
			}
			// add request header
			con.setRequestProperty("User-Agent", this.USER_AGENT);
			if (accept != null && !(accept.isEmpty())) {
				con.setRequestProperty("Accept", accept);
			}
			if (contentType != null && !(contentType.isEmpty())) {
				con.setRequestProperty("Content-Type", contentType);
			}
			if (auth != null && !(auth.isEmpty())) {
				con.setRequestProperty("Authentication", auth);
			}
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
		}
		// print result
		// logger.info(response.toString());
		return response.toString();
	}

	// HTTP POST request
	public String sendPOST(String url, String accept, String contentType, String authHeader, String json,
			boolean secure) throws Exception {

		String result = null;
		StringRequestEntity requestEntity = new StringRequestEntity(json, contentType, "UTF-8");
		PostMethod postMethod = new PostMethod(url);
		postMethod.setRequestEntity(requestEntity);
		postMethod.addRequestHeader("Authorization", authHeader);
		try {
			int statusCode = httpClient.executeMethod(postMethod);
			StringBuffer response = new StringBuffer();
			if ((statusCode >= 200) && (statusCode < 300)) {
				// String result = null;//postMethod.getResponseBodyAsString();
				BufferedReader in = new BufferedReader(new InputStreamReader(postMethod.getResponseBodyAsStream()));
				String inputLine;
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				}
				in.close();
				result = response.toString();
			}
		} finally {
			postMethod.releaseConnection();
		}
		return result;

	}

	public void logPlayerAppsAccess(String userId, String pilotId) {

		String logUrl = env.getProperty("log.endpoint");

		String body = "{\"msg\" : \"PlayerAppsAccess\",\"type\" : \"PlayerAppsAccess\", \"appId\": \"weliveplayer\", \"custom_attr\": {\"UserID\": \""
				+ userId + "\",\"PilotID\": \"" + pilotId + "\"}}";
		try {
			sendPOST(logUrl, "application/json", "application/json", loggingAuth, body, true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public void logAppInfoAccess(String userId, String artifactId, String pilotId) {

		String logUrl = env.getProperty("log.endpoint");

		String body = "{\"msg\" : \"AppInfoAccess\",\"type\" : \"AppInfoAccess\", \"appId\": \"weliveplayer\", \"custom_attr\": {\"UserID\": \""
				+ userId + "\",\"AppID\": \"" + artifactId + "\",\"PilotID\": \"" + pilotId + "\"}}";
		try {
			sendPOST(logUrl, "application/json", "application/json", loggingAuth, body, true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	
	public void logPlayerAppRecommendation(String userId, String artifactId, String pilotId) {

		String logUrl = env.getProperty("log.endpoint");

		String body = "{\"msg\" : \"PlayerAppRecommendation\",\"type\" : \"PlayerAppRecommendation\", \"appId\": \"weliveplayer\", \"custom_attr\": {\"UserID\": \""
				+ userId + "\",\"AppID\": \"" + artifactId + "\",\"PilotID\": \"" + pilotId + "\"}}";
		try {
			sendPOST(logUrl, "application/json", "application/json", loggingAuth, body, true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public static String getPilotId(String pilotId) {
		String pilotCity = "Trento";

		if (pilotId.equalsIgnoreCase("trento")) {
			pilotCity = "Trento";
		} else if (pilotId.equalsIgnoreCase("bilbao")) {
			pilotCity = "Bilbao";
		} else if (pilotId.equalsIgnoreCase("novisad")) {
			pilotCity = "Novisad";
		} else if (pilotId.equalsIgnoreCase("uusimaa")) {
			pilotCity = "Uusimaa";
		}
		return pilotCity;
	}

}
