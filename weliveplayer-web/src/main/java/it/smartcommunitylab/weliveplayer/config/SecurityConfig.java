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

package it.smartcommunitylab.weliveplayer.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.oauth2.provider.error.OAuth2AccessDeniedHandler;
import org.springframework.security.oauth2.provider.error.OAuth2AuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import eu.trentorise.smartcampus.aac.conf.OAuthAuthenticationProvider;
import eu.trentorise.smartcampus.aac.conf.OAuthTokenFilter;

@Configuration
@EnableWebMvcSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private Environment env;

	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(preauthAuthProvider());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();

		http.exceptionHandling().accessDeniedHandler(accessDeniedHandler());

		http.authorizeRequests().antMatchers(HttpMethod.OPTIONS, "/api/**").permitAll().antMatchers("/api/**")
				.fullyAuthenticated().and()
				.addFilterBefore(oauthAuthenticationFilter(), BasicAuthenticationFilter.class).httpBasic()
				.authenticationEntryPoint(authEntryPoint());

	}

	@Bean
	public OAuth2AuthenticationEntryPoint authEntryPoint() {
		OAuth2AuthenticationEntryPoint entryPoint = new OAuth2AuthenticationEntryPoint();
		return entryPoint;
	}

	@Bean
	public OAuth2AccessDeniedHandler accessDeniedHandler() {
		OAuth2AccessDeniedHandler accessDeniedHandler = new OAuth2AccessDeniedHandler();
		return accessDeniedHandler;

	}

	@Bean
	public AuthenticationEntryPoint forbEntryPoint() {
		Http403ForbiddenEntryPoint authenticationEntryPoint = new Http403ForbiddenEntryPoint();
		return authenticationEntryPoint;
	}

	@Bean
	public OAuthTokenFilter oauthAuthenticationFilter() throws Exception {
		OAuthTokenFilter oAuthTokenFilter = new OAuthTokenFilter();
		oAuthTokenFilter.setAuthenticationManager(authenticationManager());
		return oAuthTokenFilter;
	}

	@Bean
	public OAuthAuthenticationProvider preauthAuthProvider() throws Exception {
		OAuthAuthenticationProvider oAuthAuthenticationProvider = new OAuthAuthenticationProvider();
		oAuthAuthenticationProvider.setAacURL(env.getProperty("ext.aacURL"));
		oAuthAuthenticationProvider.setScope("profile.basicprofile.me");
		return oAuthAuthenticationProvider;
	}

	public AuthenticationManager authenticationManager() throws Exception {
		return super.authenticationManager();
	}

}