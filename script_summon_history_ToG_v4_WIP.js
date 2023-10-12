let histories = null
if (!__NEXT_DATA__.nodeName) {
  histories = __NEXT_DATA__.props.pageProps.histories;
} else {
  histories = JSON.parse(document.getElementById('__NEXT_DATA__').outerText).props.pageProps.histories;
}

let counter = addRarityCounter()

let table = document.querySelector('.historyPage_historyListHeadRow__bOMpF')
let table_tbody = document.querySelector('.historyPage_historyListBody__WeZjB')
let head_row = document.getElementsByClassName('historyPage_historyListHeadRow__bOMpF')[0];
let gachaSelector = document.getElementsByClassName('historyPage_gachaSelectorWrapper__Rg3jT')[0];
let viewMore = document.getElementsByClassName('historyPage_moreWrapper__Up_9i')[0];
let select = document.createElement('input');

let filter_options = {
   title: '',
   default: 'All',
   rarity: [],
   variables:{}
}

let colours = {
    "Legendary": '#ffea89',
    "Epic": '#c9bcef',
    "Rare": '#a4c8ff',
    "Uncommon": '#cdeaba',
}

let locker = ''
//----------Additional Functional----------
let getTime = (function getDate() {
   let time_stamp = new Date().getTime();

   return {
      time: (string) => {
         console.log(`${string} ${new Date().getTime() - time_stamp} ms`)
      }
   }
})();

let style = document.createElement('style');
  style.innerHTML = `
  #input {
     font-size: 18px;
     padding: 5px;
     height: 35px;
     width: 350px;
     border: 1px solid blue;
     outline: none;
     border-radius: 5px;
     color: blue;
  }
   datalist {
     position: absolute;
     background-color: white;
     border: 1px solid blue;
     border-radius: 0 0 5px 5px;
     border-top: none;
     font-family: sans-serif;
     width: 350px;
     padding: 5px;
     max-height: 10rem;
     overflow-y: auto
  }
  option {
     background-color: white;
     padding: 4px;
     color: blue;
     margin-bottom: 1px;
      font-size: 18px;
     cursor: pointer;
   }

   option:hover,  .active{
     background-color: lightblue;
   }
   fieldset {
      position: absolute;
      border: 1 px solid blue;
      width: 360 px;
      left: 200 px;
      border - radius: 5 px;
   }

   fieldset>legend, fieldset>label {
      color: #000000; 
     font-size: 24px;
     font-family: sans-serif;
   }
  `;
  document.head.appendChild(style);

function copyObjectDeepDataFromExample(data){
   return JSON.parse(JSON.stringify(data))
}

//----------Main sorter----------

function groupDataByProperty(dataArray, propertyName) {

   let groupedData = {}
   let gachaTitles = ['All']

   for (let i = dataArray.length - 1; i >= 0; i--) {
   // for (let i = 0; i < 10; i++) { //if u wanna limited output for test
      let data = dataArray[i]
      data.id = i
      let propertyValue = propertyName instanceof Function ? key(data) : data[propertyName]
      let tmpGroupDataArray = groupedData[propertyValue]

      if (!tmpGroupDataArray)
         tmpGroupDataArray = groupedData[propertyValue] = []

      workWithData(data)

      counter.addItemInTitleCounter(data)

      //data.tr = createTr(data)

      tmpGroupDataArray.push(data)
   }


   let groups = Object.keys(groupedData)

   let resultingGroupedData = []

   for (let i = 0; i < groups.length; i++) {
      let gachaName = groupedData[groups[i]][0].gachaName
      let titleID = groupedData[groups[i]][0].titleID
      let math_data = {}

      let counter_title_id = counter.titleCounter(titleID)

      gachaTitles.push(gachaName)

      resultingGroupedData.push({
         gachaName: gachaName,
         titleID: titleID,
         data: groupedData[groups[i]],
         counters: counter_title_id,
         all_item_data: counter.allCounter(titleID),
         math_data: doMathPerCategory(counter_title_id.title_counter,
                                        counter_title_id.type_counter)
      })

   }
   let all_data = counter.allCounter()
   resultingGroupedData.math_data = doMathPerCategory(all_data.all_data.length,
                                                       all_data.type_counter)
   resultingGroupedData.all_data = counter.allCounter()
   resultingGroupedData.gachaTitles = gachaTitles
   return resultingGroupedData
}

function workWithData(dataArray) {
   const itemType = dataArray.itemType.toString()[0] == 3 ? 2 : 1

   if (itemType == 2) {
      const string = dataArray.itemType.toString()[4]
      dataArray.named_item_rarity = returnItemRarity(itemType, string)
      dataArray.item = 'Ignition Weapon'
      // add function of doing with IW
   } else {
      const string = dataArray.itemType.toString().substring(1, 4)
      dataArray.named_item_rarity = returnItemRarity(itemType, string)
      dataArray.item = 'Character'
      // add function of doing with Chara
   }


   return true
}

function returnItemRarity(type, string) {
   if (type == 2) {
      switch (string) {
         case '1':
            return 'Uncommon'
         case '2':
            return 'Rare'
         case '4':
            return 'Epic'
         case '6':
         case '7':
            return 'Legendary'
         default:
            return '0'
      }
   } else {
      return ['003', '004', '010', '011', '020', 
              '027', '048','049', '052', '061', '062', 
              '064', '066', '069', '072', '073',
              '093', '151'
      ].indexOf(string) != -1 ?  'Epic': 'Legendary'
   }
}
//----------Counter----------

function addRarityCounter() {
   let counter = {}

   return {
      createTitleIdGroup(titleID){
         const rarityObjectExample = {
                  'Uncommon': {
                     all_counter:0,
                  },
                  'Rare': {
                     all_counter:0,
                  },
                  'Epic': {
                     all_counter:0,
                  },
                  'Legendary': {
                     all_counter:0,
                  },
               }
         if (!counter.all_counter) {
            counter.all_counter = {
               all_data: [],
               Character: copyObjectDeepDataFromExample(rarityObjectExample),
               'Ignition Weapon': copyObjectDeepDataFromExample(rarityObjectExample),
               type_counter: copyObjectDeepDataFromExample(rarityObjectExample),
            }
         }
         if (!counter[titleID]) {
            counter[titleID] = {
               pity_counter: 0,
               title_counter: 0,
               Character: copyObjectDeepDataFromExample(rarityObjectExample),
               'Ignition Weapon': copyObjectDeepDataFromExample(rarityObjectExample),
               type_counter: copyObjectDeepDataFromExample(rarityObjectExample),
            }
         }else{
            return this.titleCounter(titleID)
         }
      },
      addItemInTitleCounter(data) {

         let title_group = this.createTitleIdGroup(data.titleID)
         let titleId_link = counter[data.titleID]
         let all_counter = counter.all_counter

         let rarity = data.named_item_rarity

         let character_plus_rarity_link = titleId_link.Character[rarity]
         let weapon_plus_rarity_link = titleId_link['Ignition Weapon'][rarity]
         let type_plus_rarity_link = titleId_link.type_counter[rarity]

         let all_character_plus_rarity_link = all_counter.Character[rarity]
         let all_weapon_plus_rarity_link = all_counter['Ignition Weapon'][rarity]
         let all_type_plus_rarity_link = all_counter.type_counter[rarity]

         let link_group = []

         if(data.item == 'Character'){
            link_group = [
               character_plus_rarity_link,
               all_character_plus_rarity_link,
               type_plus_rarity_link,
               all_type_plus_rarity_link
             ]
         }else{
           link_group = [
            weapon_plus_rarity_link,
            all_weapon_plus_rarity_link,
            type_plus_rarity_link,
            all_type_plus_rarity_link
            ]
         }
         
         all_counter.all_data.push(data)
         this.counterAddWorker(link_group, data)

         this.increaseCounterByData(data)

      },
      counterAddWorker(link, data) {
         if (Array.isArray(link) ) {
            for (let key of link) {
               if (!key[data.itemName]) {
                  key[data.itemName] = []
               }
               key[data.itemName].push(data)
               key.all_counter++
            }
         } else {
            if (!link[data.itemName]) {
               link[data.itemName] = []
            }
            link[data.itemName].push(data)
            link.all_counter++
         }
      },

      increaseCounterByData(data) {
         let titleId_link = counter[data.titleID]
         if (!data.title_counter && !data.pity_counter) {
            data.title_counter = new Number(titleId_link.title_counter)
            data.pity_counter = new Number(titleId_link.pity_counter)
         }

         data.title_counter++
         data.pity_counter++
         titleId_link.title_counter++
         titleId_link.pity_counter++

         if(data.named_item_rarity == 'Legendary'){
            titleId_link.pity_counter = 0
         }
      },

      titleCounter(title) {
         return counter[title]
      },
      allCounter() {
         return counter.all_counter
      },
      Counter() { //only for test purpouse
         return counter
      }

   }
}
//----------Math----------
function doMathPerCategory(total_counter, type_counter) {
   let temp = {}
   for (const rarity of Object.keys(type_counter)) {
      let string = rarity + '_percentage'
      temp[string] = (type_counter[rarity].all_counter / total_counter * 100).toFixed(2)
   }
   return temp
}




//----------Table workers----------

function prepareTable() {

   table_tbody.innerHTML = '';
   gachaSelector.innerHTML = '';
   viewMore.innerHTML = '';

   let pity = document.createElement("td");
   pity.classList.add('historyPage_historyListHeadCol__VBbXi');
   pity.textContent = 'Pity';

   head_row.appendChild(pity)

   let title_counter = document.createElement("td");
   title_counter.classList.add('historyPage_historyListHeadCol__VBbXi');
   title_counter.textContent = 'Title counter';

   head_row.appendChild(title_counter)

   fillSelector(gachaSelector)
   createCheckBoxes()
}

//----------Table rows + cells----------

function createTr(obj) {
   let tr = document.createElement('tr')
   tr.classList.add(obj.named_item_rarity)
   tr.id = obj.id
   tr.classList.add('historyPage_historyListBodyRow__BcGp_');
   tr.style.backgroundColor = colours[obj.named_item_rarity];

   let time = new Date(obj.logTime).toUTCString()
   for (const item of [obj.item, obj.itemName, obj.gachaName, time, obj.pity_counter,obj.title_counter]) {
      tr.appendChild(createTd(item))
   }

   return tr
}

function createTd(value) {
   let td = document.createElement('td')
   td.textContent = value;
   td.classList.add('historyPage_historyListBodyCol___et1p'); //add css class 

   return td
}
//----------Table selector/datalist----------

function fillSelector(domElem) {
   //selector for gacha names
   select.name = 'GachaTypeList';
   select.typelist ='listbox'
   select.id = 'input'
   select.setAttribute('list', '')
   select.setAttribute('placeholder', 'Start input Title, default used All')


   let datalist = document.createElement('datalist')
   datalist.id = 'typelist'

   for (let i = group.gachaTitles.length - 1; i >= 0; i--) {
      //looping values of gacha types (all, yeon, yeon weapon, etc)
      let link = group.gachaTitles[i]
      let option = document.createElement('option'); //creating option for datalist
      option.value = link; //set up value in option
      option.text = link
      option.id = i; //set up value in option

      option.onclick = function () {
          input.value = option.value;
          typelist.style.display = 'none';
        }
      datalist.appendChild(option) //add option in parent
   }
   select.onfocus = function () {
     typelist.style.display = 'block';
     select.style.borderRadius = "5px 5px 0 0";
    let text = select.value.toUpperCase();


     createList(text, 0)
   };
   select.oninput = function() {
      let text = select.value.toUpperCase();
      if (temp_list.last != '') {
         temp_list.last.classList.remove("active");
         temp_list.last.classList = '';

      }
      temp_list = []

      if (typelist.style.display = 'none')
         typelist.style.display = 'block'

      let i = 0
      createList(text, i)
   }
   select.onkeydown = function(e) {
     if(typelist.style.display == 'none') return

     if(e.keyCode == 40){
       temp_list.curent++
       setActive(temp_list)
     }
     else if(e.keyCode == 38){
       temp_list.curent--
       setActive(temp_list)
     }
     else if(e.keyCode == 13){
       e.preventDefault();
             /*and simulate a click on the "active" item:*/
      if (temp_list) {
            temp_list[temp_list.curent].click();
            temp_list[temp_list.curent].blur();
         }
     }
   }
   domElem.appendChild(select) //added input in previous div selector 
   domElem.appendChild(datalist)

   domElem.addEventListener('change', createTable, false);
   domElem.addEventListener('input', createTable, false);
}

function createCheckBoxes() {
   let list = ["Legendary", "Epic", "Rare", "Uncommon"]
   let div = document.createElement("div")
   for (i = 0; i < list.length; i++) {
      //container div 
      let check_box_div = document.createElement('div');
      //initiate checkbox selector
      let checkbox_area = document.createElement('input');
      checkbox_area.type = 'checkbox';
      checkbox_area.value = list[i];
      checkbox_area.id = list[i]; //id == rarity (Leg, comm)

      let label = document.createElement('label'); // lable for checkbox
      label.htmlFor = list[i]; // set up id for lable
      label.textContent = list[i]; // visible text

      check_box_div.appendChild(checkbox_area); //add in container
      check_box_div.appendChild(label);

      div.appendChild(check_box_div) //add in parent container
      // checkbox_area.addEventListener("click", createTableFilteredByRarity, false);
      // checkbox_area.addEventListener("input", createTableFilteredByRarity, false);
   }
   gachaSelector.appendChild(div) //add it after selector
}

function createTable(e){
   if (locker == e.target.value) return
   let value = e.target.value;
   let from = 0
   let link = null
   let length = 0
   
   if (e.target.value == filter_options.default) {
      link = group.all_data.all_data
      length = !filter_options.variables.length ? filter_options.variables.length : link.length - 50
   }

   if (e.target.value == group[e.target.id]) {
      link = group[e.target.id].data
      length = !filter_options.variables.length ? filter_options.variables.length : link.length - 50
   }
   buildTable(link, from)

   locker = e.target.value
}


function buildTable(data, from, length=10){
   if(data == null) return
   for (var i = from; i < length; i++) {
         table_tbody.appendChild(create_table(data[i]))
      }
}

let temp_list = []




function  createList(text, counter) {
  temp_list.curent = -1
  temp_list.last = ''
   for (let option of typelist.options) {
      counter++
      if (option.value.toUpperCase().indexOf(text) > -1) {
         option.style.display = "block";
         option.total_counter = counter;
         option.id_counter = temp_list.push(option);
      } else {
         option.style.display = "none";
      }
   };
}



function setActive(list) {
    if(list.length == 0) return

    let curent = temp_list.curent
    let last = temp_list.last
    if(curent != last){
      last.classList.remove("active");
    }
    if(curent >= temp_list.length) {
      temp_list.curent = 0
      curent = 0
    } 
    if(curent < 0) {
      temp_list.curent = temp_list.length-1 
      curent = temp_list.length-1 
    } 
    temp_list[curent].classList.add("active");
    temp_list[curent].scrollIntoView({block: 'nearest'})
    input.value = temp_list[curent].value
    
    temp_list.last = temp_list[curent]

  }


getTime.time('First call before data changed')
let group = groupDataByProperty(histories, 'gachaName')
getTime.time('End of for_loop:')

prepareTable()