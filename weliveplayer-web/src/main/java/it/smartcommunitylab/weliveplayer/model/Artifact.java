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

package it.smartcommunitylab.weliveplayer.model;

import java.util.ArrayList;
import java.util.List;

public class Artifact {

	/** artifactId. **/
	private String id;
	private String description;
	private String linkImage;
	private String eId;
	private String name;
	private String city;
	private String interfaceOperation;
	private int rating;
	private String type;
	private int typeId;
	private List<Comment> comments = new ArrayList<Comment>();
	private String recommendation;
	private String tags;

	public Artifact(String id, String description, String linkImage, String eId, String name, String city,
			String interfaceOperation, int rating, String type, int typeId, List<Comment> comments,
			String recommendation) {
		super();
		this.id = id;
		this.description = description;
		this.linkImage = linkImage;
		this.eId = eId;
		this.name = name;
		this.city = city;
		this.interfaceOperation = interfaceOperation;
		this.rating = rating;
		this.type = type;
		this.typeId = typeId;
		this.comments = comments;
		this.recommendation = recommendation;
	}

	public Artifact() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLinkImage() {
		return linkImage;
	}

	public void setLinkImage(String linkImage) {
		this.linkImage = linkImage;
	}

	public String geteId() {
		return eId;
	}

	public void seteId(String eId) {
		this.eId = eId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getInterfaceOperation() {
		return interfaceOperation;
	}

	public void setInterfaceOperation(String interfaceOperation) {
		this.interfaceOperation = interfaceOperation;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}

	public String getRecommendation() {
		return recommendation;
	}

	public void setRecommendation(String recommendation) {
		this.recommendation = recommendation;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getTypeId() {
		return typeId;
	}

	public void setTypeId(int typeId) {
		this.typeId = typeId;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public static class Comment {

		private String comment;
		private String authorNode;
		private String publishDate;
		private int rating;

		public Comment() {
			// TODO Auto-generated constructor stub
		}

		public String getComment() {
			return comment;
		}

		public void setComment(String comment) {
			this.comment = comment;
		}

		public String getAuthorNode() {
			return authorNode;
		}

		public void setAuthorNode(String authorNode) {
			this.authorNode = authorNode;
		}

		public String getPublishDate() {
			return publishDate;
		}

		public void setPublishDate(String publishDate) {
			this.publishDate = publishDate;
		}

		public int getRating() {
			return rating;
		}

		public void setRating(int rating) {
			this.rating = rating;
		}

	}
}
