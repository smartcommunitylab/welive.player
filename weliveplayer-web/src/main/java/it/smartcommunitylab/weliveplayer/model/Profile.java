package it.smartcommunitylab.weliveplayer.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Profile {

	private String ccUserID;
	private String name;
	private String surname;
	private String gender;
	private String birthdate;
	private String address;
	private String city;
	private String country;
	private String zipCode;
	private String email;
	private List<String> languages = new ArrayList<String>();
	private boolean isDeveloper = false;
	private List<String> skills = new ArrayList<String>();
	private List<String> usedApps = new ArrayList<String>();
	private Map<String, Integer> profileData = new HashMap<String, Integer>();
	private Map<String, Double> lastKnownLocation = new HashMap<String, Double>();
	private List<String> thirdParties = new ArrayList<String>();
	
	public Profile() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getCcUserID() {
		return ccUserID;
	}

	public void setCcUserID(String ccUserID) {
		this.ccUserID = ccUserID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(String birthdate) {
		this.birthdate = birthdate;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<String> getLanguages() {
		return languages;
	}

	public void setLanguages(List<String> languages) {
		this.languages = languages;
	}

	public boolean isDeveloper() {
		return isDeveloper;
	}

	public void setDeveloper(boolean isDeveloper) {
		this.isDeveloper = isDeveloper;
	}

	public List<String> getSkills() {
		return skills;
	}

	public void setSkills(List<String> skills) {
		this.skills = skills;
	}

	public List<String> getUsedApps() {
		return usedApps;
	}

	public void setUsedApps(List<String> usedApps) {
		this.usedApps = usedApps;
	}

	public Map<String, Integer> getProfileData() {
		return profileData;
	}

	public void setProfileData(Map<String, Integer> profileData) {
		this.profileData = profileData;
	}

	public Map<String, Double> getLastKnownLocation() {
		return lastKnownLocation;
	}

	public void setLastKnownLocation(Map<String, Double> lastKnownLocation) {
		this.lastKnownLocation = lastKnownLocation;
	}

	public List<String> getThirdParties() {
		return thirdParties;
	}

	public void setThirdParties(List<String> thirdParties) {
		this.thirdParties = thirdParties;
	}


}
