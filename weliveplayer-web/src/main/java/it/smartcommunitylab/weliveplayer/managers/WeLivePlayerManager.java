/**
 * Copyright 2016 Smart Community Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package it.smartcommunitylab.weliveplayer.managers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import it.smartcommunitylab.weliveplayer.exception.WeLivePlayerCustomException;
import it.smartcommunitylab.weliveplayer.model.Artifact;
import it.smartcommunitylab.weliveplayer.model.Artifact.Comment;
import it.smartcommunitylab.weliveplayer.model.Profile;
import it.smartcommunitylab.weliveplayer.utils.WeLivePlayerUtils;

/**
 *
 * @author nawazk
 *
 */
@Component
public class WeLivePlayerManager {

	private static final transient Log logger = LogFactory.getLog(WeLivePlayerManager.class);

	@Autowired
	private WeLivePlayerUtils weLivePlayerUtils;
	@Autowired
	private Environment env;
	/** Authorization. **/
	public static String authHeader = "Basic d2VsaXZlQHdlbGl2ZS5ldTp3M2wxdjN0MDBscw==";
	/** objectmapper. **/
	private static ObjectMapper mapper = new ObjectMapper();
	/** application cache. **/
	private LoadingCache<String, List<Artifact>> appsCache;
	/** application comments cache. **/
	private LoadingCache<String, List<Comment>> appCommentsCache;

	/**
	 * Apps Cache Generator.
	 * 
	 * @throws ExecutionException
	 */
	@PostConstruct
	public void init() throws ExecutionException {
		// create a cache for List<Artifact> based on city.
		appsCache = CacheBuilder.newBuilder().expireAfterAccess(10, TimeUnit.MINUTES)
				.build(new CacheLoader<String, List<Artifact>>() {
					@Override
					public List<Artifact> load(String city) throws Exception {
						List<Artifact> artifacts = getArtifacts(city, "ALL");
						return artifacts;
					}
				});

		appCommentsCache = CacheBuilder.newBuilder().expireAfterAccess(10, TimeUnit.MINUTES)
				.build(new CacheLoader<String, List<Comment>>() {

					@Override
					public List<Comment> load(String appId) throws Exception {
						List<Comment> comments = getComments(appId);
						return comments;
					}

				});

	}

	protected List<Comment> getComments(String artifactId) throws WeLivePlayerCustomException {
		List<Comment> commentsList = new ArrayList<Comment>();

		String url = env.getProperty("welive.mkp.singleApp.uri");
		url = url.replace("{artefact-id}", artifactId);

		try {
			String response = weLivePlayerUtils.sendGET(url, "application/json", null, authHeader, -1);

			// weLivePlayerUtils.log(artifactId);
			if (response != null && !response.isEmpty()) {
				JSONObject root = new JSONObject(response);
				if (root.has("name")) {
					JSONArray comments = root.getJSONArray("comments");
					for (int c = 0; c < comments.length(); c++) {
						Artifact.Comment comment = new Artifact.Comment();
						JSONObject commentResponse = comments.getJSONObject(c);
						if (commentResponse.has("text")) {
							comment.setComment(commentResponse.getString("text"));
						}
						if (commentResponse.has("creation_date")) {
							comment.setPublishDate(commentResponse.getString("creation_date"));
						}
						if (commentResponse.has("author_ccUid")) {
							comment.setAuthorNode(commentResponse.getString("author_ccUid"));

						}

						commentsList.add(comment);
					}
				}

			}
		} catch (Exception e) {

			throw new WeLivePlayerCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		return commentsList;
	}

	private List<Artifact> getArtifacts(String pilotId, String appType) throws WeLivePlayerCustomException {
		List<Artifact> artifacts = new ArrayList<Artifact>();

		String url = env.getProperty("welive.mkp.uri");
		url = url.replace("{pilotId}", "All");// pilotId
		url = url.replace("{appType}", "All");// appType

		try {
			String response = weLivePlayerUtils.sendGET(url, "application/json", null, authHeader, -1);
			if (response != null && !response.isEmpty()) {
				JSONObject root = new JSONObject(response);
				if (root.has("artefacts")) {
					JSONArray artifactsArray = root.getJSONArray("artefacts");
					for (int i = 0; i < artifactsArray.length(); i++) {
						JSONObject artifact = artifactsArray.getJSONObject(i);
						Artifact temp = new Artifact();
						temp.setId(artifact.getString("artefactId"));
						temp.setCity(pilotId);
						String imageLink = artifact.getString("linkImage");
						if (!imageLink.isEmpty()) {
							if (!imageLink.startsWith("http")) {
								imageLink = env.getProperty("welive.server") + imageLink;
							}
							temp.setLinkImage(imageLink);
						}

						temp.setName(artifact.getString("name"));
						temp.setDescription(artifact.getString("description"));
						temp.seteId(artifact.getString("eId"));
						temp.setInterfaceOperation(artifact.getString("interfaceOperation"));
						temp.setRating(artifact.getInt("rating"));
						temp.setType(artifact.getString("type"));
						temp.setTypeId(artifact.getInt("typeId"));
						JSONArray comments = artifact.getJSONArray("comments");
						for (int c = 0; c < comments.length(); c++) {
							Artifact.Comment comment = new Artifact.Comment();
							JSONObject commentResponse = comments.getJSONObject(c);
							if (commentResponse.has("text")) {
								comment.setComment(commentResponse.getString("text"));
							}
							if (commentResponse.has("creation_date")) {
								comment.setPublishDate(commentResponse.getString("creation_date"));
							}
							if (commentResponse.has("author_ccUid")) {
								comment.setAuthorNode(commentResponse.getString("author_ccUid"));

							}

							temp.getComments().add(comment);
						}

						artifacts.add(temp);

					}
				}
			}

		} catch (Exception e) {

			throw new WeLivePlayerCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		return artifacts;
	}

	public List<Artifact> getArtifacts(String userId, String pilotId, String appType, int page, int count)
			throws WeLivePlayerCustomException {

		// log here.
		weLivePlayerUtils.logEvent(userId, pilotId, null);

		List<Artifact> artifacts = new ArrayList<>();
		try {
			artifacts = appsCache.get(pilotId);
		} catch (ExecutionException e) {
			throw new WeLivePlayerCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		List<Artifact> paginatedList = new ArrayList<>();
		// pagination.
		if (artifacts != null && !artifacts.isEmpty() && (page * count) <= artifacts.size()) {
			if (((page + 1) * count) <= artifacts.size()) {
				paginatedList = artifacts.subList(page * count, (page + 1) * count);
			} else {
				paginatedList = artifacts.subList(page * count, artifacts.size());
			}

		}

		return paginatedList;

	}

	public List<Comment> getArtifactComments(String userId, String artifactId, int page, int count)
			throws WeLivePlayerCustomException {

		List<Comment> commentsList = new ArrayList<Comment>();

		try {
			commentsList = appCommentsCache.get(artifactId);
		} catch (ExecutionException e) {
			throw new WeLivePlayerCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		List<Comment> paginatedList = new ArrayList<>();
		// pagination.
		if (!commentsList.isEmpty() && (page * count) <= commentsList.size()) {
			if (((page + 1) * count) <= commentsList.size()) {
				paginatedList = commentsList.subList(page * count, (page + 1) * count);
			} else {
				paginatedList = commentsList.subList(page * count, commentsList.size());
			}

		}

		return paginatedList;
	}

	public Profile getUserProfile(String authorizationHeader) throws WeLivePlayerCustomException {

		Profile profile = null;

		String aacUri = env.getProperty("ext.aacURL") + "/basicprofile/me";

		try {

			String response = weLivePlayerUtils.sendGET(aacUri, "application/json", "application/json",
					authorizationHeader, -1);

			if (response != null && !response.isEmpty()) {

				JSONObject root = new JSONObject(response.toString());

				if (root.has("userId")) {
					// read userId.
					String userId = "0"; // root.getString("userId");
					// invoke cdv profile api.
					String url = env.getProperty("welive.cdv.profile.uri");
					url = url.replace("{id}", userId);

					String profileAPIResponse = weLivePlayerUtils.sendGET(url, "application/json", "application/json",
							authHeader, -1);

					if (profileAPIResponse != null && !profileAPIResponse.isEmpty()) {
						JSONObject profileJson = new JSONObject(profileAPIResponse);
						if (profileJson.has("name")) {
							profile = new Profile();
							profile.setAddress(profileJson.getString("address"));
							profile.setBirthdate(profileJson.getString("birthdate"));
							profile.setCcUserID(profileJson.getString("ccUserID"));
							profile.setCity(profileJson.getString("city"));
							profile.setCountry(profileJson.getString("country"));
							profile.setDeveloper(profileJson.getBoolean("isDeveloper"));
							profile.setEmail(profileJson.getString("email"));
							profile.setGender(profileJson.getString("gender"));
							profile.setLanguages(mapper.readValue(profileJson.get("languages").toString(), List.class));
							profile.setLastKnownLocation(
									mapper.readValue(profileJson.get("lastKnownLocation").toString(), HashMap.class));
							profile.setName(profileJson.getString("name"));
							profile.setProfileData(
									mapper.readValue(profileJson.get("profileData").toString(), HashMap.class));
							profile.setSkills(mapper.readValue(profileJson.get("skills").toString(), List.class));
							profile.setSurname(profileJson.getString("surname"));
							profile.setThirdParties(
									mapper.readValue(profileJson.get("thirdParties").toString(), List.class));
							profile.setUsedApps(mapper.readValue(profileJson.get("usedApps").toString(), List.class));
							profile.setZipCode(profileJson.getString("zipCode"));

						}

					}

				} else {
					throw new WeLivePlayerCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
							"user not found");
				}
			}

		} catch (Exception e) {

			throw new WeLivePlayerCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		return profile;
	}

	public String getUserId(String authorizationHeader) throws WeLivePlayerCustomException {

		String userId = null;

		String aacUri = env.getProperty("ext.aacURL") + "/basicprofile/me";

		try {

			String response = weLivePlayerUtils.sendGET(aacUri, "application/json", "application/json",
					authorizationHeader, -1);

			if (response != null && !response.isEmpty()) {

				JSONObject root = new JSONObject(response.toString());

				if (root.has("userId")) {

					userId = root.getString("userId");

				} else {
					throw new WeLivePlayerCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
							"user not found");
				}
			}

		} catch (Exception e) {

			throw new WeLivePlayerCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
		}

		return userId;
	}

}