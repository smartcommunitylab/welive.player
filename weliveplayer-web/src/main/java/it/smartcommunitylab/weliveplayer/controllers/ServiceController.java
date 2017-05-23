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

package it.smartcommunitylab.weliveplayer.controllers;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import it.smartcommunitylab.weliveplayer.exception.WeLivePlayerCustomException;
import it.smartcommunitylab.weliveplayer.managers.WeLivePlayerManager;
import it.smartcommunitylab.weliveplayer.model.Artifact;
import it.smartcommunitylab.weliveplayer.model.Artifact.Comment;
import it.smartcommunitylab.weliveplayer.model.Profile;
import it.smartcommunitylab.weliveplayer.model.Response;
import it.smartcommunitylab.weliveplayer.utils.WeLivePlayerUtils;

/**
 *
 * @author nawazk
 *
 */
@Controller
public class ServiceController {

	@Autowired
	private WeLivePlayerManager weLivePlayerManager;

	@RequestMapping(method = RequestMethod.GET, value = "/api/apps/ping")
	public @ResponseBody Response<String> pong() {
		return new Response<String>("pong");
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/api/apps/{pilotId}/{appType}")
	public @ResponseBody Response<List<Artifact>> getArtifacts(@PathVariable String pilotId,
			@PathVariable String appType,
			@RequestParam(required = false) String lat,
			@RequestParam(required = false) String lon,
			@RequestParam(required = false) Integer start,
			@RequestParam(required = false) Integer count, HttpServletRequest httpRequest)
			throws WeLivePlayerCustomException {

		String authHeader = httpRequest.getHeader("Authorization");

		return new Response<List<Artifact>>(weLivePlayerManager.getArtifacts(authHeader, getUserId(authHeader), pilotId, appType, lat, lon,
				(start == null ? 0 : start), (count == null ? 20 : count)));

	}

	@RequestMapping(method = RequestMethod.GET, value = "/api/userProfile")
	public @ResponseBody Response<Profile> getUserProfile(HttpServletRequest httpRequest)
			throws WeLivePlayerCustomException {

		String authHeader = httpRequest.getHeader("Authorization");

		return new Response<Profile>(weLivePlayerManager.getUserProfile(authHeader));

	}

	@RequestMapping(method = RequestMethod.POST, value = "/api/update/userProfile")
	public @ResponseBody Response<String> updateUserProfile(HttpServletRequest httpRequest,
			@RequestBody Profile profile) throws WeLivePlayerCustomException {

		String authHeader = httpRequest.getHeader("Authorization");
		
		Response<String> response = new Response<String>();

		Map<String, String> errorMap = weLivePlayerManager.updateUserProfile(getUserId(authHeader), profile);

		if (errorMap.isEmpty()) {
			response.setData("user profile updated successfully.");
		} else if (errorMap.containsKey(WeLivePlayerUtils.ERROR_CODE)) {
			throw new WeLivePlayerCustomException(Integer.valueOf(errorMap.get(WeLivePlayerUtils.ERROR_CODE)),
					errorMap.get(WeLivePlayerUtils.ERROR_MSG));
		}

		return response;

	}

	@RequestMapping(method = RequestMethod.GET, value = "/api/appComments/{artifactId}")
	public @ResponseBody Response<List<Comment>> getAppComments(@PathVariable String artifactId,
			@RequestParam(required = false) Integer start, @RequestParam(required = false) Integer count,
			HttpServletRequest httpRequest) throws WeLivePlayerCustomException {

		String authHeader = httpRequest.getHeader("Authorization");

		return new Response<List<Comment>>(weLivePlayerManager.getArtifactComments(getUserId(authHeader), artifactId,
				(start == null ? 0 : start), (count == null ? 20 : count)));

	}

	@ExceptionHandler(Exception.class)
	public @ResponseBody Response<Void> handleExceptions(Exception exception, HttpServletResponse response) {
		Response<Void> res = exception instanceof WeLivePlayerCustomException
				? ((WeLivePlayerCustomException) exception).getBody()
				: new Response<Void>(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, exception.getMessage());
		response.setStatus(res.getErrorCode());
		return res;
	}

	private String getUserId(String authHeader) throws WeLivePlayerCustomException {

		return weLivePlayerManager.getUserId(authHeader);
	}

}
