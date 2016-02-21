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

import it.smartcommunitylab.weliveplayer.exception.WeLivePlayerCustomException;
import it.smartcommunitylab.weliveplayer.managers.WeLivePlayerManager;
import it.smartcommunitylab.weliveplayer.model.Artifact;
import it.smartcommunitylab.weliveplayer.model.Response;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author nawazk
 *
 */
@Controller
public class ServiceController {

	@Autowired
	private WeLivePlayerManager weLivePlayerManager;

	@RequestMapping(method = RequestMethod.GET, value = "/api/apps/{pilotId}/{appType}")
	public @ResponseBody
	Response<List<Artifact>> readDriverTrips(@PathVariable String pilotId, @PathVariable String appType,
			@RequestParam(required = false) Integer start, @RequestParam(required = false) Integer count)
			throws WeLivePlayerCustomException {
		
		return new Response<List<Artifact>>(weLivePlayerManager.getArtifacts(getUserId(), (start == null ? 0 : start),
				(count == null ? 20 : count)));
		
	}

	@ExceptionHandler(Exception.class)
	public @ResponseBody
	Response<Void> handleExceptions(Exception exception, HttpServletResponse response) {
		Response<Void> res = exception instanceof WeLivePlayerCustomException ? ((WeLivePlayerCustomException) exception)
				.getBody() : new Response<Void>(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, exception.getMessage());
		response.setStatus(res.getErrorCode());
		return res;
	}

	private String getUserId() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername() : principal.toString();
	}

}
