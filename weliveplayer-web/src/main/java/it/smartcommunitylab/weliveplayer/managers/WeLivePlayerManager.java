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

import it.smartcommunitylab.weliveplayer.model.Artifact;
import it.smartcommunitylab.weliveplayer.model.Artifact.Comment;
import it.smartcommunitylab.weliveplayer.utils.WeLivePlayerUtils;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

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
	
	public List<Artifact> getArtifacts(String userId, String pilotId, String appType, int page, int count) {

		List<Artifact> artifacts = new ArrayList<Artifact>();

		String url = env.getProperty("welive.mkp.uri");
		url = url.replace("{pilotId}", "All");//pilotId
		url = url.replace("{appType}", "All");//appType
		
		
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
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		
		return artifacts;
	}

	public List<Comment> getArtifactComments(String userId, String artifactId, int i, int j) {
		
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
						if (commentResponse.has("author_ccUid")) {
							comment.setAuthorNode(commentResponse.getString("author_ccUid"));

						}
						
						commentsList.add(comment);
					}
				}

			}

		} catch (Exception e) {
			
			e.printStackTrace();
		}
		
		return commentsList;
		
	}

}