#Sample grouped data
`group` variable had data grouped by [`title_id`][^1]
```js
[Object]
"group" = {
	[Number] 0: {
		[Object] "all_data": {
			"Character": {
				"Epic": {...},
				"Legendary": {...},
				"Rare": {...},
				"Uncommon":{...},
				"all_counter": Number,
			},
			"Ignition Weapon":{
				...
			}
			"pity_counter": Number,
			"title_counter" : Number,
			"type_counter": {
				...
			}
		},
		[Object] "data": [Object, ...],
		[Object] "math_data":{
			"Epic_percentage": Number
			"Legendary_percentage": Number
			"Rare_percentage": Number
			"Uncommon_percentage": Number
		},
		"titleID": Number
	}
	...
}
```


Variable block [`'Character'`]:

```js
[Object]
"Character": {
			[Object] "Epic": {
					 [Object] 'ItemName' : {
					 	[ 
					 		[Object] "items", 
					 		...
					 	]
					},
						...
					"all_counter": Number
				},
				...
			},
```
Variable block [`'items'`] from [`'Character.Epic'`]:

```js
[Object]
"items": [
	[Number] 0 : [Object] {
		  "userUID": Number [Account Id], //set up via Server
		  "accountID": Number [Account Id], //set up via Server
		  "logTime": Date [Zulu Time Zone], //Zulu same to UTC time those
		  "gachaType": Number [Title Id], //set up via Server
		  "gachaName": String [Title name],
		  "itemType": Number [Item Id],
		  "itemName": String [Item name],
		  "titleID": Number [Title Id], //set up via Script
		  "id": Number [Unique Id], 
		  "named_item_rarity": String [Item rarity],
		  "item": String [Item type],
		  "title_counter": Number [Total title counter],
		  "pity_counter": Number [Pity counter]
		}
	]
```
[`"Ignition Weapon"`] and [`"type_counter"`] block same as previous [`"Character"`] object

```js
[Array]
"gachaTitles":[
	[Number] 0 : [String] "All",
	...
]
```
[`"gachaTitles"`] is `Array` of avaible by summons titles names

[`"math_data"`] is percent counter for full data from [`group`]. Has same structure as [`group[title_id].math_data`]
```js
[Object]
"math_data":{
	"Epic_percentage": Number
	"Legendary_percentage": Number
	"Rare_percentage": Number
	"Uncommon_percentage": Number
},
```

body
	floating stuck data
		1 data info to ALL data
			
			pity (average value ALL) //count


			% leg to all rolls  //count


			each rarity counter
				leg  //count,epic //count,rare,common count/%


			each type counter
				char,weapon
					per each person?/weapon?


		2 data info to FILTERED table by gacha type
			pity 
				average value IF leg choosen ELSE -- 
			% leg
			each rarity counter
				leg,epic,rare,common count/%
			each type counter
				char,weapon
			screenshot
				only visible / all ONLY by filter (leg / type)

table
	header
		add/set_up col (
		Item Type, Item Name, Event Name, Timestamp, Pity, Total of type, Total
		)
	t_body
		set_up rows
		add_class
			RGB
