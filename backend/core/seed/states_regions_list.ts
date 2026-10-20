import { ObjectId } from "mongodb";

export const state_list = [
	{
		_id: new ObjectId(),
		name: "Alabama",
		abbreviation: "AL",
		region: [{name: "Montgomery Area"},{name: "Birmingham Area"},{name: "Mobile Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Arizona",
		abbreviation: "AZ",
		region: [{name: "Tuscon Area"},{name: "Phoenix Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Arkansas",
		abbreviation: "AR",
		region: [{name: "Little Rock Area"}]
	},
	{
		_id: new ObjectId(),
		name: "California",
		abbreviation: "CA",
		region: [{name: "Southern California"},{name: "San Luis Obispo\/Santa Barbara Area"},{name: "Fresno Area"},{name: "Sacramento Area"},{name: "San Francisco Area"},{name: "San Diego Area"},{name: "San Jose Area"},{name: "Inland Empire Area"},{name: "Santa Rosa Area"},{name: "Riverside Area"},{name: "Salinas Area"},{name: "Stockton Area"},{name: "San Gabriel Valley"},{name: "San Bernadino Area"},{name: "Palm Springs Area"},{name: "Lancaster Area"},{name: "Ventura Area"},{name: "Oakland\/East Bay Area"},{name: "Burbank Area"},{name: "Northern California"},{name: "Palm Desert Area"},{name: "Thousand Oaks Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Colorado",
		abbreviation: "CO",
		region: [{name: "Denver\/Fort Collins Area"},{name: "Colorado Springs Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Connecticut",
		abbreviation: "CT",
		region: [{name: "Hartford Area"},{name: "Hartford"}]
	},
	{
		_id: new ObjectId(),
		name: "Delaware",
		abbreviation: "DE",
		region: [{name: "Wilmington Area"},{name: "Georgetown Area"}]
	},
	{
		_id: new ObjectId(),
		name: "District of Columbia",
		abbreviation: "DC",
		region: [{name:"DC Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Florida",
		abbreviation: "FL",
		region: [{name: "Tampa Area"},{name: "Tallahassee Area"},{name: "Orlando Area"},{name: "Palm Beach Area"},{name: "Miami Area"},{name: "Ft. Lauderdale Area"},{name: "Jacksonville"},{name: "Pensacola Area"},{name: "New Smyrna Beach"}]
	},
	{
		_id: new ObjectId(),
		name: "Georgia",
		abbreviation: "GA",
		region: [{name: "Atlanta Area"},{name: "Macon Area"},{name: "Augusta Area"},{name: "Savannah "}]
	},
	{
		_id: new ObjectId(),
		name: "Idaho",
		abbreviation: "ID",
		region: [{name: "Pocatello Area"},{name: "Boise"}]
	},
	{
		_id: new ObjectId(),
		name: "Illinois",
		abbreviation: "IL",
		region: [{name: "Chicago Area"},{name: "Rockford Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Indiana",
		abbreviation: "IN",
		region: [{name: "Louisville Area"},{name: "Indianapolis Area"},{name: "South Bend Area"},{name: "Fort Wayne"}]
	},
	{
		_id: new ObjectId(),
		name: "Iowa",
		abbreviation: "IA",
		region: [{name: "waterloo \/ Cedar Rapids"},{name: "Des Moines"}]
	},
	{
		_id: new ObjectId(),
		name: "Kansas",
		abbreviation: "KS",
		region: [{name: "Topeka"},{name: "Junction City \/ Grandview Plaza"},{name: "Wichita"}]
	},
	{
		_id: new ObjectId(),
		name: "Kentucky",
		abbreviation: "KY",
		region: [{name: "Bowling Green"}]
	},
	{
		_id: new ObjectId(),
		name: "Louisiana",
		abbreviation: "LA",
		region: [{name: "Shreveport Area"},{name: "Lafayette Area"},{name: "Baton Rouge Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Maryland",
		abbreviation: "MD",
		region: [{name: "Baltimore Area"},{name: "DC  Area"},{name: "Wilmington\/Newark"},{name: "Cumberland"},{name: "Marlboro Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Massachusetts",
		abbreviation: "MA",
		region: [{name: "Boston Area"},{name: "Springfield"}]
	},
	{
		_id: new ObjectId(),
		name: "Michigan",
		abbreviation: "MI",
		region: [{name: "Detroit Area"},{name: "Lansing Area"},{name: "Grand Rapids Area"},{name: "Flint Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Minnesota",
		abbreviation: "MN",
		region: [{name: "Minneapolis Area"},{name: "St. Paul Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Missouri",
		abbreviation: "MO",
		region: [{name: "Kansas City Area"},{name: "St. Louis Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Montana",
		abbreviation: "MT",
		region: [{name: "Columbia Falls Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Nebraska",
		abbreviation: "NE",
		region: [{name: "Lincoln Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Nevada",
		abbreviation: "NV",
		region: [{name: "Las Vegas Area"}]
	},
	{
		_id: new ObjectId(),
		name: "New Jersey",
		abbreviation: "NJ",
		region: [{name: "Newark Area"},{name: "North Jersey Area"},{name: "Philadelphia\/Wilmington Area"},{name: "South Jersey Area"}]
	},
	{
		_id: new ObjectId(),
		name: "New Mexico",
		abbreviation: "NM",
		region: [{name: "Albuquerque Area"}]
	},
	{
		_id: new ObjectId(),
		name: "New York",
		abbreviation: "NY",
		region: [{name: "New York City Area"},{name: "Albany Area"},{name: "Bergen County Area"},{name: "Buffalo Area"},{name: "Niagara Falls Area"}]
	},
	{
		_id: new ObjectId(),
		name: "North Carolina",
		abbreviation: "NC",
		region: [{name: "Charlotte Area"},{name: "Fayetteville Area"},{name: "Wilmington Area"},{name: "Raleigh Area"},{name: "Greenville"}]
	},
	{
		_id: new ObjectId(),
		name: "Ohio",
		abbreviation: "OH",
		region: [{name: "Canton Area"},{name: "Toledo Area"},{name: "Columbus Area"},{name: "Dayton Area"},{name: "Cleveland Area"},{name: "Cincinnati Area"},{name: "Akron Area"},{name: "Youngstown Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Oklahoma",
		abbreviation: "OK",
		region: [{name: "Atlus\/Lawton Area"},{name: "Oklahoma City"},{name: "Tulsa"}]
	},
	{
		_id: new ObjectId(),
		name: "Oregon",
		abbreviation: "OR",
		region: [{name: "Portland Area"},{name: "Salem Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Pennsylvania",
		abbreviation: "PA",
		region: [{name: "Philadelphia Area"},{name: "Pittsburgh Area"},{name: "Lancaster \/ York"},{name: "Wyoming \/ Scranton"},{name: "East Pennsylvania"},{name: "West Pennsylvania"}]
	},
	{
		_id: new ObjectId(),
		name: "Rhode Island",
		abbreviation: "RI",
		region: [{name: "Rhode Island"}]
	},
	{
		_id: new ObjectId(),
		name: "South Carolina",
		abbreviation: "SC",
		region: [{name: "Myrtle Beach Area"},{name: "Columbia Area"}]
	},
	{
		_id: new ObjectId(),
		name: "South Dakota",
		abbreviation: "SD",
		region: [{name: "Sioux City"}]
	},
	{
		_id: new ObjectId(),
		name: "Tennessee",
		abbreviation: "TN",
		region: [{name: "Knoxville Area"},{name: "Nashville Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Texas",
		abbreviation: "TX",
		region: [{name: "Houston Area"},{name: "Austin Area"},{name: "Dallas Area"},{name: "San Antonio Area"},{name: "Corpus Christi"},{name: "El Paso Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Utah",
		abbreviation: "UT",
		region: [{name: "Salt Lake City Area"},{name: "Springville Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Virginia",
		abbreviation: "VA",
		region: [{name: "Greater DC Area"},{name: "Richmond Area"},{name: "Virginia Beach"}]
	},
	{
		_id: new ObjectId(),
		name: "Washington",
		abbreviation: "WA",
		region: [{name: "Seattle\/Tacoma Area"},{name: "Richland Area"},{name: "Yakima Area"},{name: "Spokane Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Wisconsin",
		abbreviation: "WI",
		region: [{name: "Minneapolis"},{name: "MN Area"},{name: "Milwaukee Area"},{name: "St. Paul"},{name: "	MN Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Ontario (CA)",
		abbreviation: "ON",
		region: [{name: "Toronto Area"},{name: "St. Catherines Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Quebec (CA)",
		abbreviation: "QC",
		region: [{name: "Montreal Area"}]
	},
	{
		_id: new ObjectId(),
		name: "British Columbia (CA)",
		abbreviation: "BC",
		region: [{name: "Vancouver Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Saskatchewan (CA)",
		abbreviation: "SK",
		region: [{name: "Regina Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Alberta (CA)",
		abbreviation: "AB",
		region: [{name: "Calgary Area"}]
	},
	{
		_id: new ObjectId(),
		name: "Gauteng(South Africa)",
		abbreviation: "Ga-SA",
		region: [{name: "Germiston"}]
	},
	{
		_id: new ObjectId(),
		name: "Eastern Cape(South Africa)",
		abbreviation: "EC-SA",
		region: [{name: "Port Elizabeth"}]
	}
	]