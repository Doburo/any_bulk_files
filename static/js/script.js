let histories = null
if (!__NEXT_DATA__.nodeName) {
  histories = __NEXT_DATA__.props.pageProps.histories;
} else {
  histories = JSON.parse(document.getElementById('__NEXT_DATA__').outerText).props.pageProps.histories;
}

document.getElementById('__NEXT_DATA__').remove()

let counter = addRarityCounter()
let vision = null

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
  variables: {}
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
  .Legendary {
   background-color: #ffea89;
  }
  .Epic {
   background-color: #c9bcef;
  }
  .Rare {
   background-color: #a4c8ff;
  }
  .Uncommon {
   background-color: #cdeaba;
  } 
  #input {
     font-size: 18px;
     padding: 5px;
     height: 35px;
     width: 100%;
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
     width: 100%;
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
     overflow-x: auto
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

window.onclick= function(e) {
  if(e.target != input){
    typelist.style.display = 'none'
    input.blur()
  }else{
    return
  }
}


function copyObjectDeepDataFromExample(data) {
  return JSON.parse(JSON.stringify(data))
}

//----------Main sorter----------

function groupDataByProperty(dataArray, propertyName) {

  let groupedData = {}
  let gachaTitles = ['All']

  for (let i = dataArray.length - 1; i >= 0; i--) {
    // for (let i = 0; i < 10; i++) { //if u wanna limited output for test
    let data = dataArray[i]
    data.id = dataArray.length - i
    let propertyValue = propertyName instanceof Function ? key(data) : data[propertyName]
    let tmpGroupDataArray = groupedData[propertyValue]

    if (!tmpGroupDataArray)
      tmpGroupDataArray = groupedData[propertyValue] = []

    setUpItemRarityAndType(data)
    counter.addItemInTitleCounter(data)

    // data.tr = createTr(data)

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
      all_data: counter_title_id,
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

function setUpItemRarityAndType(dataArray) {
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
    return [ '003', '004', '010', '011', 
      '020', '027', '048', '049', '052', 
      '061', '062', '064', '066', '069',
      '072', '073', '093', '151'
    ].indexOf(string) != -1 ? 'Epic' : 'Legendary'
  }
}
//----------Counter----------

function addRarityCounter() {
  let counter = {} // main logger for counting
  const rarityObjectExample = { // template for data
        'Uncommon': {all_data: [],},
        'Rare': {all_data: [],},
        'Epic': {all_data: [],},
        'Legendary': {all_data: [],},
        'all_data': [],
      }

  return {
    setUpTitleIdGroup(var_name) {
      if (!counter[var_name]) {
        let link = copyObjectDeepDataFromExample(rarityObjectExample)
        let raw_object = {
          all_data: [],
          Character: link,
          pity_counter: 0,
          title_counter: 0,
          'Ignition Weapon': link,
          type_counter: link,
        }
        return counter[var_name] = copyObjectDeepDataFromExample(raw_object)
      }
      return counter[var_name]
    },
    createTitleIdGroup(titleID) {
      if (!counter.all_data) {
        this.setUpTitleIdGroup('all_data')
        delete counter.all_data.pity_counter
        delete counter.all_data.title_counter
      }
      if (!counter[titleID]) {
        return this.setUpTitleIdGroup(titleID)
      }else{
        return counter[titleID]
      }

    },
    addItemInTitleCounter(data) {

      let title_group = this.createTitleIdGroup(data.titleID)

      this.counterAddWorker(data) 
    },

    counterAddWorker(data) {
      //Need rewrite this section... Its kinda cRiNgE
      
      //----object data links-----
      let titleID = data.titleID //from what title
      let name = data.itemName // what name
      let rarity = data.named_item_rarity //rarity of item
      let type = data.item // what type (character/Ignition Weapon)
      
      //----links for counters in Title category(Character/Weapon)-----
      let r_link = counter[titleID][type][rarity]
      let t_link = counter[titleID][type]
      
      //----links for counters in Title category(Epic/Leg/etc)-----
      let r_r_link = counter[titleID]['type_counter'][rarity]
      let t_r_link = counter[titleID]['type_counter']

      //----links for counters in [all_data] category(Character/Weapon)-----
      let a_r_link = counter.all_data[type][rarity]
      let a_t_link = counter.all_data[type]
      
      //----links for counters in [all_data] category(Epic/Leg/etc)-----
      let a_r_r_link = counter.all_data['type_counter'][rarity]
      let a_t_r_link = counter.all_data['type_counter']

      counter[titleID].pity_counter++
      counter[titleID].title_counter++
      data.pity_counter = new Number(counter[titleID].pity_counter)
      data.title_counter = new Number(counter[titleID].title_counter)

      if(!r_link[name]){
        r_link[name] = []
        r_r_link[name] = []
        a_r_link[name] = []
        a_r_r_link[name] = []
      }
      // counter['58981']["Character"]['Epic'].push({})
      r_link[name].push(data)
      r_r_link[name].push(data)
      a_r_link[name].push(data)
      a_r_r_link[name].push(data)
      counter.all_data.all_data.push(data) //push item into all_data


      let linkForIncrease = [
        r_link, t_link, // titleId link
        r_r_link, t_r_link, // type_counter link
        a_r_link, a_t_link, // all titleId link
        a_r_r_link, a_t_r_link, // all type_counter link
        ]

      for(let i = 0; i < linkForIncrease.length; i++){
        linkForIncrease[i].all_data.push(data)
      }
      
      if(rarity == "Legendary"){
        counter[titleID].pity_counter = 0
      }
    },
    titleCounter(title) {
      return counter[title]
    },
    allCounter() {
      return counter.all_data
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
    if(!type_counter[rarity].all_data) break
    let string = rarity + '_percentage'
    temp[string] = (type_counter[rarity].all_data.length / total_counter * 100).toFixed(2)
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

  let total_counter = document.createElement("td");
  total_counter.classList.add('historyPage_historyListHeadCol__VBbXi');
  total_counter.textContent = 'Total counter';

  head_row.appendChild(total_counter)

  fillSelector(gachaSelector)
  createCheckBoxes()
}

//----------Table rows + cells----------

function createTr(obj) {
  let tr = document.createElement('tr')
  tr.classList.add(obj.named_item_rarity)
  tr.id = obj.id
  tr.classList.add('historyPage_historyListBodyRow__BcGp_');

  let time = new Date(obj.logTime).toUTCString()
  for (const item of [obj.item,
   obj.itemName, obj.gachaName, 
   time, obj.pity_counter, 
   obj.title_counter, obj.id]) {
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
  select.typelist = 'listbox'
  select.id = 'input'
  select.setAttribute('list', '')
  select.setAttribute('placeholder', 'Start input title')


  let datalist = document.createElement('datalist')
  datalist.id = 'typelist'

  for (let i = 0; i < group.gachaTitles.length; i++) {
    //looping values of gacha types (all, yeon, yeon weapon, etc)
    let link = group.gachaTitles[i]
    let option = document.createElement('option'); //creating option for datalist
    option.value = link; //set up value in option
    option.text = link
    if(link == 'All'){
      option.id = 'all_data'
    } else {
      option.id = i - 1; //set up value in option
    }

    option.onclick = function(e) {
      input.value = option.value;
      filter_options.title = input.id

      tableWorker();
    }
    datalist.appendChild(option) //add option in parent
    select.appendChild(datalist) //added input in previous div selector 
  }
  select.onclick = function() {
    typelist.style.display = 'block';
    select.style.borderRadius = "5px 5px 0 0";
    let text = select.value.toUpperCase();
    createList(text, 0)
  };

  select.oninput = function() {
    let text = select.value.toUpperCase();
    if (temp_list.last != '' && temp_list.curent != -1) {

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
    if (typelist.style.display == 'none') return

    if (e.keyCode == 40) {
      temp_list.curent++
      setActive(temp_list)
    } else if (e.keyCode == 38) {
      temp_list.curent--
      setActive(temp_list)
    } else if (e.keyCode == 13) {
      e.preventDefault();
      /*and simulate a click on the "active" item:*/
      if (temp_list && temp_list[temp_list.curent]) {
        temp_list[temp_list.curent].click();
      }else{
        temp_list.last.click()
      }
    }
  }
  domElem.appendChild(select) //added input in previous div selector 
  domElem.appendChild(datalist)

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
    checkbox_area.value = 
    checkbox_area.id = list[i]; //id == rarity (Leg, comm)

    let label = document.createElement('label'); // lable for checkbox
    label.htmlFor =  // set up id for lable
    label.textContent = list[i]; // visible text

    check_box_div.appendChild(checkbox_area); //add in container
    check_box_div.appendChild(label);

    div.appendChild(check_box_div) //add in parent container
    checkbox_area.addEventListener("click", filterRaritySetup, false);
    // checkbox_area.addEventListener("input", createTableFilteredByRarity, false);
  }
  gachaSelector.appendChild(div) //add it after selector
}

function tableWorker(e) {
  let data = group.all_data.all_data
  let length = group.all_data.all_data.length
  // checkInputValue()
  // checkFilterData()
  // checkAdditionalFilterValue()
  buildTable(data, 0, length) //data object, start from, length of table
}

// function checkInpuValue() {
//   if(input.value == ''){
//     return
//   }else if(input.value.charAt(0).toUpperCase().indexOf())

// }

function filterRaritySetup(e) {
  let check = e.target.checked
  let value = e.target.value

  let input_value = input.value
  let from = 0
  let link = null
  console.log('filterRaritySetup')
  if (input_value == filter_options.default ||
      input_value == '') { //input = '' or 'All'
    link = group.all_data
  }else{
    //input = title (Yeon, Albelda etc)
    for(let titleID of group){
      console.log(titleID)
      if(titleID.gachaName == input.value){
        link = titleID
      }
    }
    
  }

  let length = filter_options.variables.length ? filter_options.variables.length : 50


  if (check && filter_options.rarity.indexOf(value) == -1) {
    filter_options.rarity.push(value)
  } else {
    let index = filter_options.rarity.indexOf(value)
    filter_options.rarity.splice(index, 1)
  }
   let f_option = filter_options.rarity

  if(f_option.length == 0){ // no filter at all

    buildTable(link.all_data, 0, length)

  }else if(f_option.length == 1){ // only 1 of filters

    buildTable(link.all_data.type_counter[f_option], 0, length)


  }else{ // any count of filters

    return filter_options.rarity

  }
}

//number + 10 to  from 
function buildTable(data, from=null, length = 0) {
  if (data == null) return
  table_tbody.innerHTML = ''
  let start = from ? from : 0 
  let end = start + length < data.length ? start + length : data.length
  if(filter_options.rarity.length <= 1){
    for (let i = start; i < end; i++) {
      table_tbody.insertBefore(createTr(data[i]), 
        table_tbody.childNodes[0] == undefined ? null : table_tbody.childNodes[0])
    }
  }else{
    let i = 0
    for (let i = start; i < end; i++) {
        table_tbody.insertBefore(createTr(data[i]), 
        table_tbody.childNodes[0] == undefined ? null : table_tbody.childNodes[0])
    }
  }
}


let temp_list = []



function createList(text, counter) {

  for (let option of typelist.options) {
    counter++
    if (option.value.toUpperCase().indexOf(text) > -1) {
      option.style.display = "block";
      option.total_counter = counter;
      if(temp_list.indexOf(option) == -1)
        option.id_counter = temp_list.push(option);
    } else {
      option.style.display = "none";
    }
  }
  temp_list[0].classList.add('active')

  temp_list.last = temp_list[0]
}



function setActive(list) {
  if (list.length == 0) return

  let curent = temp_list.curent
  let last = temp_list.last
  if (curent != last) {
    last.classList.remove("active");
  }
  if (curent >= temp_list.length) {
    temp_list.curent = 0
    curent = 0
  }
  if (curent < 0) {
    temp_list.curent = temp_list.length - 1
    curent = temp_list.length - 1
  }
  temp_list[curent].classList.add("active");
  temp_list[curent].scrollIntoView({
    block: 'nearest'
  })
  input.value = temp_list[curent].value

  temp_list.last = temp_list[curent]

}


getTime.time('First call before data changed')
let group = groupDataByProperty(histories, 'gachaName')
getTime.time('End of for_loop:')
console.log(group)
prepareTable()
getTime.time('Clean up HTML:')