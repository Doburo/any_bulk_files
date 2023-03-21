let histories = __NEXT_DATA__.props.pageProps.histories;

let gacha_datas = __NEXT_DATA__.props.pageProps.gachaDatas;


let title_counter = {}

let getTime = (function getDate(string) {
   let time_stamp = new Date().getTime();

   return {
      time: (string) => {
         console.log(`${string} ${new Date().getTime() - time_stamp} ms`)
      }
   }
})();


function groupDataByProperty(dataArray, propertyName) {
   let groupedData = {}
   title_counter.all_items_counter = dataArray.length
   for (let i = dataArray.length - 1; i >= dataArray.length - 10; i--) {
      let data = dataArray[i]
      data.id = i

      //do we have sort value ? if not we take 1st key of item : else value from item property
      let propertyValue = propertyName instanceof Function ? key(data) : data[propertyName]

      let tmpGroupDataArray = groupedData[propertyValue]

      if (!tmpGroupDataArray)
         tmpGroupDataArray = groupedData[propertyValue] = []

      workWithData(data)
      data.counter = workWithCounter(data.titleID, data.named_item_rarity)
      data.tr = createTr(data)

      tmpGroupDataArray.push(data)
   }
   editTable()

   let groups = Object.keys(groupedData)

   let resultingGroupedData = []

   for (let i = 0; i < groups.length; i++) {
      let gachaName = groupedData[groups[i]][0].gachaName
      let titleID = groupedData[groups[i]][0].titleID
      resultingGroupedData.push({
         gachaName: gachaName,
         titleID: titleID,
         data: groupedData[groups[i]],
         title_counter: groupedData[groups[i]].length
      })
   }

   return resultingGroupedData
}



function workWithCounter(title, rarity) {
   !title_counter[title] ?
      title_counter[title] = 1 : title_counter[title]++

   // u idiot 
   let rarity_c = !title_counter[rarity] ?
      title_counter[rarity] = 1 : title_counter[rarity]++ //pity to rarity counter

   if(rarity == 'Legendary'){
      title_counter[rarity] = 1
   }

   return {
      type_counter: title_counter[title],
      pity_counter: rarity_c
   }

}

function workWithData(dataArray) {
   const itemType = dataArray.itemType.toString()[0] == 3 ? 2 : 1

   if (itemType == 2) {
      const string = dataArray.itemType.toString()[4]
      dataArray.named_item_rarity = returnItemRarity(itemType, string)
      dataArray.item = 'Ignition Weapon'
   } else {
      const string = dataArray.itemType.toString().substring(1, 4)
      dataArray.named_item_rarity = returnItemRarity(itemType, string)
      dataArray.item = 'Character'
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
      return ['001', '005', '012',
         '013', '017', '021',
         '036', '038', '040',
         '041', '044', '051',
         '057', '058', '092',
         '094'
      ].indexOf(string) != -1 ? 'Legendary' : 'Epic'
   }
}

function editTable() {
   let table = document.querySelector('.historyPage_historyListHeadRow__bOMpF')
   let table_tbody = document.querySelector('.historyPage_historyListBody__WeZjB')
   let head_row = document.getElementsByClassName('historyPage_historyListHeadRow__bOMpF')[0];


   let pity = document.createElement("td");
       pity.classList.add('historyPage_historyListHeadCol__VBbXi');
       pity.textContent = 'Pity';

   head_row.appendChild(pity)

}

function createTr(obj) {
   let tr = document.createElement('tr')
   tr.classList.add(obj.named_item_rarity)
   tr.id = obj.id

   let time = new Date(obj.logTime).toUTCString()
   for (const item of [obj.item, obj.itemName, obj.gachaName, time]) {
      tr.appendChild(createTd(item))
   }

   return tr
}

function createTd(value) {
   let td = document.createElement('td')
   td.textContent = value;
   return td
}

getTime.time('First call before data changed')
let group =  groupDataByProperty(histories, 'gachaName')
console.log(group)
getTime.time('End of for_loop:')
