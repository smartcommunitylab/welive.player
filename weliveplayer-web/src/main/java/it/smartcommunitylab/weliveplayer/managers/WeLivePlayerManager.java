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
import java.util.Map;
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
import org.springframework.http.HttpStatus;
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

	private static final String PSA = "PSA";

	private static final String BB = "BuildingBlock";

	private static final String DS = "Dataset";

	@Autowired
	private WeLivePlayerUtils weLivePlayerUtils;
	@Autowired
	private Environment env;
	/** Authorization. **/
	public static String authHeader = "Basic d2VsaXZlQHdlbGl2ZS5ldTp3M2wxdjN0MDBscw==";
	/** objectmapper. **/
	private static ObjectMapper mapper = new ObjectMapper();
	/** application cache. **/
	private LoadingCache<String, List<Artifact>> artifactsPSA;
	private LoadingCache<String, List<Artifact>> artifactsBB;
	private LoadingCache<String, List<Artifact>> artifactsDataset;
	/** application comments cache. **/
	private LoadingCache<String, List<Comment>> appCommentsCache;
	/** application type. **/
	private static String appType = "PSA";
	/** appId-pilot map. **/
	private static Map<String, String> appInfoMap = new HashMap<String, String>();

	/**
	 * Apps Cache Generator.
	 * 
	 * @throws ExecutionException
	 */
	@PostConstruct
	public void init() throws ExecutionException {
		// create a cache for List<Artifact> based on city.
		artifactsPSA = CacheBuilder.newBuilder().expireAfterAccess(10, TimeUnit.MINUTES)
				.build(new CacheLoader<String, List<Artifact>>() {
					@Override
					public List<Artifact> load(String city) throws Exception {
						List<Artifact> artifacts = getArtifacts(city, PSA);
						return artifacts;
					}
				});

		artifactsBB = CacheBuilder.newBuilder().expireAfterAccess(10, TimeUnit.MINUTES)
				.build(new CacheLoader<String, List<Artifact>>() {
					@Override
					public List<Artifact> load(String city) throws Exception {
						List<Artifact> artifacts = getArtifacts(city, BB);
						return artifacts;
					}
				});

		artifactsDataset = CacheBuilder.newBuilder().expireAfterAccess(10, TimeUnit.MINUTES)
				.build(new CacheLoader<String, List<Artifact>>() {
					@Override
					public List<Artifact> load(String city) throws Exception {
						List<Artifact> artifacts = getArtifacts(city, DS);
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
						if (commentResponse.has("author")) {
							comment.setAuthorNode(commentResponse.getString("author"));

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

		pilotId = WeLivePlayerUtils.getPilotId(pilotId);

		url = url.replace("{pilotId}", pilotId);// pilotId
		url = url.replace("{appType}", appType);// appType

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
						temp.setDescription(artifact.getString("description").replace("\\n", "<br />"));
						temp.seteId(artifact.getString("eId"));

						/** to be removed in future. **/
						temp.setReferredPilotId(pilotId);
						appInfoMap.put(temp.getId(), pilotId + WeLivePlayerUtils.KEYSEPARATOR + temp.getName());
						/** to be removed in future. **/

						if (artifact.has("url")) {
							temp.setUrl(artifact.getString("url"));
						}
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
						// tags.
						if (artifact.has("tags")) {
							JSONArray appTags = artifact.getJSONArray("tags");
							temp.setTags(appTags.join(", ").replace("\"", ""));
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

	public List<Artifact> getArtifacts(String authHeader, String userId, String pilotId, String appType, int page,
			int count) throws WeLivePlayerCustomException {

		// log here.
		weLivePlayerUtils.logPlayerAppsAccess(userId, pilotId);

		List<Artifact> artifacts = new ArrayList<>();
		try {
			if (appType.equalsIgnoreCase(PSA)) {
				artifacts = artifactsPSA.get(pilotId);
			} else if (appType.equalsIgnoreCase(BB)) {
				artifacts = artifactsBB.get(pilotId);
			} else if (appType.equalsIgnoreCase(DS)) {
				artifacts = artifactsDataset.get(pilotId);
			}
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

		// make first application recommended(to remove later).
		if (!paginatedList.isEmpty()) {
			// make call to user app recommendation api.
			String recommAPIUri = env.getProperty("welive.de.user.recomm.apps.uri");
			recommAPIUri = recommAPIUri.replace("{id}", userId);
			try {
				String response = weLivePlayerUtils.sendGET(recommAPIUri, "application/json", null, authHeader, -1);
				List<?> recommApps = mapper.readValue(response, List.class);
				if (recommApps != null && !recommApps.isEmpty()) {
					// log here.
					// weLivePlayerUtils.logPlayerAppRecommendation(userId, recommAppId, pilotId);
					// map recommends apps to paginated list.

				} else {
					paginatedList.get(0).setRecommendation(true);
				}
			} catch (Exception e) {
				paginatedList.get(0).setRecommendation(true);
				throw new WeLivePlayerCustomException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
			}

		}

		return paginatedList;

	}

	public List<Comment> getArtifactComments(String userId, String artifactId, int page, int count)
			throws WeLivePlayerCustomException {

		// log here.
		if (appInfoMap.containsKey(artifactId)) {
			String appInfo[] = appInfoMap.get(artifactId).split(WeLivePlayerUtils.KEYSEPARATOR);
			weLivePlayerUtils.logAppInfoAccess(userId, artifactId, appInfo[0], appInfo[1]);
		}

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

	public Profile getUserProfile(String bearerHeader) throws WeLivePlayerCustomException {

		Profile profile = null;

		String aacUri = env.getProperty("ext.aacURL") + "/basicprofile/me";

		try {

			String response = weLivePlayerUtils.sendGET(aacUri, "application/json", "application/json", bearerHeader,
					-1);

			if (response != null && !response.isEmpty()) {

				JSONObject root = new JSONObject(response.toString());

				if (root.has("userId")) {
					// read userId.
					String userId = root.getString("userId");
					// invoke cdv profile api.
					String url = env.getProperty("welive.cdv.getUserprofile.uri");
					// url = url.replace("{id}", userId);

					String profileAPIResponse = weLivePlayerUtils.sendGET(url, "application/json", "application/json",
							bearerHeader, -1);

					if (profileAPIResponse != null && !profileAPIResponse.isEmpty()) {
						JSONObject profileJson = new JSONObject(profileAPIResponse);
						if (profileJson.has("name")) {
							profile = new Profile();
							profile.setName(profileJson.getString("name"));
							// fields.
							if (profileJson.has("address"))
								profile.setAddress(profileJson.getString("address"));
							if (profileJson.has("birthdate"))
								profile.setBirthdate(profileJson.getString("birthdate"));
							if (profileJson.has("ccUserID"))
								profile.setCcUserID(profileJson.getString("ccUserID"));
							if (profileJson.has("city"))
								profile.setCity(profileJson.getString("city"));
							if (profileJson.has("country"))
								profile.setCountry(profileJson.getString("country"));
							if (profileJson.has("isDeveloper"))
								profile.setDeveloper(profileJson.getBoolean("isDeveloper"));
							if (profileJson.has("email"))
								profile.setEmail(profileJson.getString("email"));
							if (profileJson.has("gender"))
								profile.setGender(profileJson.getString("gender"));
							if (profileJson.has("surname"))
								profile.setSurname(profileJson.getString("surname"));
							if (profileJson.has("zipCode"))
								profile.setZipCode(profileJson.getString("zipCode"));
							if (profileJson.has("referredPilot"))
								profile.setReferredPilot(profileJson.getString("referredPilot"));
							// if (profileJson.has("usedApps")
							// &&
							// !profileJson.get("usedApps").toString().equalsIgnoreCase("[]"))
							// {
							//
							// JSONArray usedApps = (JSONArray)
							// profileJson.get("usedApps");
							//
							// List<String> usedAppsSet = new
							// ArrayList<String>();
							//
							// for (int i = 0; i < usedApps.length(); i++) {
							// JSONObject usedApp = (JSONObject)
							// usedApps.get(i);
							// usedAppsSet.add(String.valueOf(usedApp.get("appName")));
							// }
							//
							// profile.setUsedApps(usedAppsSet);
							// }
							if (profileJson.has("skills")
									&& !profileJson.get("skills").toString().equalsIgnoreCase("[]")) {

								JSONArray skills = (JSONArray) profileJson.get("skills");

								List<String> skillSet = new ArrayList<String>();
								for (int i = 0; i < skills.length(); i++) {
									JSONObject skill = (JSONObject) skills.get(i);
									skillSet.add(String.valueOf(skill.get("skillName")));
								}

								profile.setSkills(skillSet);

							}
							if (profileJson.has("languages")
									&& !profileJson.get("languages").toString().equalsIgnoreCase("[]")) {
								profile.setLanguages(
										mapper.readValue(profileJson.get("languages").toString(), List.class));
							}
							// if (profileJson.has("thirdParties")
							// &&
							// !profileJson.get("thirdParties").toString().equalsIgnoreCase("[]"))
							// {
							// profile.setThirdParties(
							// mapper.readValue(profileJson.get("thirdParties").toString(),
							// List.class));
							// }
							// if (profileJson.has("lastKnownLocation")
							// &&
							// !profileJson.get("lastKnownLocation").toString().equalsIgnoreCase("{}"))
							// {
							// profile.setLastKnownLocation(mapper
							// .readValue(profileJson.get("lastKnownLocation").toString(),
							// HashMap.class));
							// }
							// if (profileJson.has("profileData")
							// &&
							// !profileJson.get("profileData").toString().equalsIgnoreCase("{}"))
							// {
							// profile.setProfileData(
							// mapper.readValue(profileJson.get("profileData").toString(),
							// HashMap.class));
							// }

							// get user tags.
							String userTagsUrl = env.getProperty("welive.cdv.getUserTags.uri");
							userTagsUrl = userTagsUrl.replace("{id}", userId);

							String userTagResponse = weLivePlayerUtils.sendGET(userTagsUrl, null, null, authHeader, -1);

							if (userTagResponse != null && !userTagResponse.isEmpty()) {
								JSONObject userTagsJson = new JSONObject(userTagResponse);

								if (userTagsJson.has("userTags")
										&& !userTagsJson.get("userTags").toString().equalsIgnoreCase("[]")) {
									profile.setUserTags(
											mapper.readValue(userTagsJson.get("userTags").toString(), List.class));
								}
							}

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

	public Map<String, String> updateUserProfile(String userId, Profile profile) {

		Map<String, String> status = new HashMap<String, String>();

		try {

			if (profile != null) {

				// check if passed in token user has same id as the one in
				// profile body.
				if (profile.getCcUserID().equalsIgnoreCase(userId)) {

					String url = env.getProperty("welive.cdv.updateUserprofile.uri");
					// url = url.replace("{id}", userId);

					String response = weLivePlayerUtils.sendPOST(url, null, "application/json", authHeader,
							profile.updateProfileBody(), true);

					if (response != null && !response.isEmpty()) {

						JSONObject root = new JSONObject(response.toString());

						if (root.has("text")) {
							if (!root.getString("response").equalsIgnoreCase("0")) {
								status.put(WeLivePlayerUtils.ERROR_CODE,
										String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()));
								status.put(WeLivePlayerUtils.ERROR_MSG, root.toString());
							}
						}
					}
				} else {
					status.put(WeLivePlayerUtils.ERROR_CODE, String.valueOf(HttpStatus.FORBIDDEN.value()));
					status.put(WeLivePlayerUtils.ERROR_MSG, "user not authorized");
				}

			} else {
				status.put(WeLivePlayerUtils.ERROR_CODE, String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()));
				status.put(WeLivePlayerUtils.ERROR_MSG, "null profile sent");
			}

		} catch (Exception e) {
			status.put(WeLivePlayerUtils.ERROR_CODE, String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()));
			status.put(WeLivePlayerUtils.ERROR_MSG, e.getMessage());
		}

		return status;
	}

}