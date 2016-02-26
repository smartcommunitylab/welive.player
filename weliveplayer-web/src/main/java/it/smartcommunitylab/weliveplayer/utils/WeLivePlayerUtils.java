package it.smartcommunitylab.weliveplayer.utils;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

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
		URL obj = new URL(url);
		// HTTPS.
		if (secure) {
			HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
			// add request header
			con.setRequestMethod("POST");
			con.setRequestProperty("User-Agent", this.USER_AGENT);
			con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

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
			wr.writeBytes(body);
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
			con.setRequestProperty("User-Agent", this.USER_AGENT);
			con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

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
			wr.writeBytes(body);
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

	public void logEvent(String userId, String pilotId, Object object) {

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

}
