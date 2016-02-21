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

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;

/**
 *
 * @author nawazk
 *
 */
@Component
public class WeLivePlayerManager {

	private static final transient Log logger = LogFactory.getLog(WeLivePlayerManager.class);

	public List<Artifact> getArtifacts(String userId, int i, int j) {
		// TODO Auto-generated method stub
		return null;
	}


}