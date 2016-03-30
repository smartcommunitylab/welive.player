package it.smartcommunitylab.weliveplayer.utils;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;
import java.util.Date;

import javax.net.ssl.HttpsURLConnection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class WeLivePlayerUtils {

	/** USER AGENT. **/
	private String USER_AGENT = "Mozilla/5.0";
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
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
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
	public String sendPOST(String url, String accept, String contentType, String auth, String body, boolean secure)
			throws Exception {

		StringBuffer response = new StringBuffer();
		
		String value = new String(body.getBytes("UTF-8"));
		
		URL obj = new URL(url);
		// HTTPS.
		if (secure) {
			HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
			// add request header
			con.setRequestMethod("POST");
			
			if (accept != null && !(accept.isEmpty())) {
				con.setRequestProperty("Accept", accept);
			}
			if (contentType != null && !(contentType.isEmpty())) {
				con.setRequestProperty("Content-Type", contentType);
			}
			if (auth != null && !(auth.isEmpty())) {
				con.setRequestProperty("Authorization", auth);
			}

			// Send post request
			con.setDoOutput(true);

			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(value);
			wr.flush();
			wr.close();
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
		} else { // HTTP.
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			// add request header
			con.setRequestMethod("POST");
			
			if (accept != null && !(accept.isEmpty())) {
				con.setRequestProperty("Accept", accept);
			}
			if (contentType != null && !(contentType.isEmpty())) {
				con.setRequestProperty("Content-Type", contentType);
			}
			if (auth != null && !(auth.isEmpty())) {
				con.setRequestProperty("Authentication", auth);
			}
			// Send post request
			con.setDoOutput(true);

			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(value);
			wr.flush();
			wr.close();

			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
		}
		// logger.info(response.toString());
		return response.toString();

	}

	public void logPlayerAppsAccess(String userId, String pilotId) {

		String logUrl = env.getProperty("log.endpoint");

		String body = "{\"msg\" : \"PlayerAppsAccess\",\"type\" : \"PlayerAppsAccess\", \"appId\": \"weliveplayer\", \"custom_attr\": {\"UserID\": \""
				+ userId + "\",\"PilotID\": \"" + pilotId + "\"}}";
		try {
			sendPOST(logUrl, "application/json", "application/json", "", body, true);
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
			sendPOST(logUrl, "application/json", "application/json", "", body, true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
