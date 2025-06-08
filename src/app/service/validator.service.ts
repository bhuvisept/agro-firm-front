import { Component, OnInit } from '@angular/core';
export class ValidatorList {
	static account_validation_messages: any = {

		'username': [
			{ type: 'required', message: 'Username is required' },
			{ type: 'minlength', message: 'Username must be at least 5 characters long' },
			{ type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
			{ type: 'pattern', message: 'Your username must contain only numbers and letters' },
			{ type: 'validUsername', message: 'Your username has already been taken' }
		],
		'fname' : [
			{ type: 'required', message: 'First Name is required'}
		],
		'lname' : [
			{ type: 'required', message: 'Last Name is required'}
		],
		'email' : [
			{ type: 'required', message: 'Email is required' },
			{ type: 'pattern', message: 'Enter a valid Email' },
			{ type: 'emailValidator', message: 'Enter a valid email' },
		],
		'mobile_no' : [
			{ type: 'pattern', message: 'Please enter valid Mobile No'},
			{ type: 'required',  message: 'Mobile No is required'},
		],
		'clinic_name' : [
			{ type: 'required', message: 'Clinic Name is required'}
		],
		'address' : [
			{ type: 'required', message: 'First Name is required'}
		],
		'role_name' : [
			{ type: 'required', message: 'Role Name is required'}
		],
		'role_title' : [
			{ type: 'required', message: 'Role Title is required'},
			{ type: 'patter', message: 'Role Title must be in UPPER CASE'}
		],
		'state' : [
			{ type: 'required', message: 'Please Select State'}
		],
		'country' : [
			{ type: 'required', message: 'Please Select Country'}
		],
		'skillname' : [
			{ type: 'required', message: 'Please enter skill'}
		],
		'cust_pricing' : [
			{ type: 'required', message: 'Please enter Pricing Code you want to set'}
		],
		'cust_pricing_desc' : [
			{ type: 'required', message: 'Please enter description'}
		],
		'current_password':[
			 { type: 'required', message: 'Please enter your cuurent password'}
		],
		'new_password':[
			{ type: 'required', message: 'Please enter your new password'},
			{ type: 'pattern', message: `Password must be At least 8 characters,
										A mixture of both uppercase and lowercase letters,
										A mixture of letters and numbers,
										Inclusion of at least one special character, e.g., ! @ # ? `},
		],
		'confirm_password':[
			{ type: 'required', message: 'Please enter your confirm password'},
			{ type: 'pattern', message: `Password must be At least 8 characters,
										A mixture of both uppercase and lowercase letters,
										A mixture of letters and numbers,
										Inclusion of at least one special character, e.g., ! @ # ? `},
		],
		'password' :[
			{ type: 'required', message: 'Please enter password'},
			{ type: 'pattern', message: `Password must be At least 8 characters,
										A mixture of both uppercase and lowercase letters,
										A mixture of letters and numbers,
										Inclusion of at least one special character, e.g., ! @ # ? `},
		],
		'user_name':[
			{ type: 'required', message: 'Name is require'}
		],
		// 'confirm_password' :[
		// 	{ type: 'required', message: 'Please enter password'},
		// ],
		'name':[
			{ type: 'required', message: 'Event Name is required' },			
		],
		'description':[
			{ type: 'required', message: 'Event Description is required' },			
		],
		'startDate':[
			{ type: 'required', message: 'Event StartDate is required' },			
		],
		'eventDuration':[
			{ type: 'required', message: 'Event Duration is required' },			
		],
		'endDate':[
			{ type: 'required', message: 'Event EndDate is required' },			
		],
		'location':[
			{ type: 'required', message: 'Location is required' },			
		],
		'type':[
			{ type: 'required', message: 'Event Type is required' },			
		],
		'noOfAttendee':[
			{ type: 'required', message: 'Seats Available is required' },			
		],
		'eventFee':[
			{ type: 'required', message: 'Event Fees is required' },			
		],
		'socialMedialLink':[
			{ type: 'required', message: 'Social Media Link is required' },			
		],
		'aboutBrand':[
			{ type: 'required', message: 'About Brand Name is required' },			
		],
		'category':[
			{ type: 'required', message: 'Event Category is required' },			
		],
		
		'companyName':[
			{ type: 'required', message: 'Comapny Category is required' },			
		],
		

	}


	static country_state: any = {
		'countryName' : [
			// { countryName: 'Australia'},
			{ countryName: 'Canada'},
			{ countryName: 'USA'},
			
			// { countryName: 'India'},
		],
		'USA' : [
			{	"stateName": "Alabama",							},
			{	"stateName": "Alaska",							},
			{	"stateName": "American Samoa",					},
			{	"stateName": "Arizona",							},
			{	"stateName": "Arkansas",						},
			{	"stateName": "California",						},
			{	"stateName": "Colorado",						},
			{	"stateName": "Connecticut",						},
			{	"stateName": "Delaware",						},
			{	"stateName": "District Of Columbia",			},
			{	"stateName": "Federated States Of Micronesia",	},
			{	"stateName": "Florida",							},
			{	"stateName": "Georgia",							},
			{	"stateName": "Guam",							},
			{	"stateName": "Hawaii",							},
			{	"stateName": "Idaho",							},
			{	"stateName": "Illinois",						},
			{	"stateName": "Indiana",							},
			{	"stateName": "Iowa",							},
			{	"stateName": "Kansas",							},
			{	"stateName": "Kentucky",						},
			{	"stateName": "Louisiana",						},
			{	"stateName": "Maine",							},
			{	"stateName": "Marshall Islands",				},
			{	"stateName": "Maryland",						},
			{	"stateName": "Massachusetts",					},
			{	"stateName": "Michigan",						},
			{	"stateName": "Minnesota",						},
			{	"stateName": "Mississippi",						},
			{	"stateName": "Missouri",						},
			{	"stateName": "Montana",							},
			{	"stateName": "Nebraska",						},
			{	"stateName": "Nevada",							},
			{	"stateName": "New Hampshire",					},
			{	"stateName": "New Jersey",						},
			{	"stateName": "New Mexico",						},
			{	"stateName": "New York",						},
			{	"stateName": "North Carolina",					},
			{	"stateName": "North Dakota",					},
			{	"stateName": "Northern Mariana Islands",		},
			{	"stateName": "Ohio",							},
			{	"stateName": "Oklahoma",						},
			{	"stateName": "Oregon",							},
			{	"stateName": "Palau",							},
			{	"stateName": "Pennsylvania",					},
			{	"stateName": "Puerto Rico",						},
			{	"stateName": "Rhode Island",					},
			{	"stateName": "South Carolina",					},
			{	"stateName": "South Dakota",					},
			{	"stateName": "Tennessee",						},
			{	"stateName": "Texas",							},
			{	"stateName": "Utah",							},
			{	"stateName": "Vermont",							},
			{	"stateName": "Virgin Islands",					},
			{	"stateName": "Virginia",						},
			{	"stateName": "Washington",						},
			{	"stateName": "West Virginia",					},
			{	"stateName": "Wisconsin",						},
			{	"stateName": "Wyoming",							},
		],
		'Canada' : [
			{	"stateName": "Alberta",							},
			{	"stateName": "British Columbia",				},
			{	"stateName": "Manitoba",						},
			{	"stateName": "New Brunswick",					},
			{	"stateName": "Newfoundland and Labrador",		},
			{	"stateName": "Northwest Territories",			},
			{	"stateName": "Nova Scotia",						},
			{	"stateName": "Nunavut",							},
			{	"stateName": "Ontario",							},
			{	"stateName": "Prince Edward Island",			},
			{	"stateName": "Quebec",							},
			{	"stateName": "Saskatchewan",					},
			{	"stateName": "Yukon",							},
		],
		'India' : [
			{	"stateName": "Andhra Pradesh",					},
			{	"stateName": "Arunachal Pradesh",				},
			{	"stateName": "Assam",							},
			{	"stateName": "Bihar",							},
			{	"stateName": "Chhattisgarh",					},
			{	"stateName": "Goa",								},
			{	"stateName": "Gujarat",							},
			{	"stateName": "Haryana",							},
			{	"stateName": "Himachal Pradesh",				},
			{	"stateName": "Jammu and Kashmir",				},
			{	"stateName": "Jharkhand",						},
			{	"stateName": "Karnataka",						},
			{	"stateName": "Kerala",							},
			{	"stateName": "Madhya Pradesh",					},
			{	"stateName": "Maharashtra",						},
			{	"stateName": "Manipur",							},
			{	"stateName": "Meghalaya",						},
			{	"stateName": "Mizoram",							},
			{	"stateName": "Nagaland",						},
			{	"stateName": "Odisha",							},
			{	"stateName": "Punjab",							},
			{	"stateName": "Rajasthan",						},
			{	"stateName": "Sikkim",							},
			{	"stateName": "Tamil Nadu",						},
			{	"stateName": "Telangana",						},
			{	"stateName": "Tripura",							},
			{	"stateName": "Uttar Pradesh",					},
			{	"stateName": "Uttarakhand",						},
			{	"stateName": "West Bengal",						},
		],
		// 'Australia' : [
		// 	{	"stateName": "Australian Capital Territory",	},
		// 	{	"stateName": "New South Wales",					},
		// 	{	"stateName": "Northern Territory",				},
		// 	{	"stateName": "Queensland",						},
		// 	{	"stateName": "South Australia",					},
		// 	{	"stateName": "Tasmania",						},
		// 	{	"stateName": "Victoria",						},
		// 	{	"stateName": "Western Australia",				},
		// ],
	  }

	static numberNotRequiredValidator(number): any {
		if (number.pristine) {
			return null;
		}
		const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;

		number.markAsTouched();

		var value = number.value.trim();

		if (NUMBER_REGEXP.test(value)) {
			return {
				numberNotRequiredValidator: true
			};
		}

		return null;
	}

	static percentValidation(number): any {
		if (number.pristine) {
			return null;
		}
		number.markAsTouched();
		var temp_number = parseInt(number.value)
		if ((temp_number > 100) || (temp_number < 0)) {
			return {
				percentValidation: true
			}
		}
		else {
			return null
		}
	}

	static avoidEmptyStrigs(value): any {
		if (value.pristine) {
			return null;
		}

		value.markAsTouched();

		if (value.value.trim() == '' && value.value.length > 0) {
			return {
				avoidEmptyStrigs: true
			};
		}

		return null;
	}

	static emailValidator(value): any {

		if (value.pristine) {
			return null;
		}

		if (value.value.length == 0) {
			return;
		}


		const EMAIL_REGEXP = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		value.markAsTouched();

		if (EMAIL_REGEXP.test(value.value)) {
			return null;
		}

		return {
			emailValidator: true
		};
	}

	static nameValidator(value): any {

		if (value.pristine) {
			return null;
		}

		if (value.value.length == 0) {
			return;
		}


		const EMAIL_REGEXP = /^[^\s]+$/;

		value.markAsTouched();

		if (EMAIL_REGEXP.test(value.value)) {
			return null;
		}

		return {
			namelValidator: true
		};
	}

}