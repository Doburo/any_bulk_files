let histories = __NEXT_DATA__.props.pageProps.histories;

let gacha_datas = __NEXT_DATA__.props.pageProps.gachaDatas;


let counter = addRarityCounter()


let getTime = (function getDate() {
   let time_stamp = new Date().getTime();

   return {
      time: (string) => {
         console.log(`${string} ${new Date().getTime() - time_stamp} ms`)
      }
   }
})();


function groupDataByProperty(dataArray, propertyName) {
   
   let groupedData = {}
   counter.all_items_counter = dataArray.length

   for (let i = dataArray.length - 1; i >= 0; i--) {
      let data = dataArray[i]
          data.id = i
      let propertyValue = propertyName instanceof Function ? key(data) : data[propertyName]
      let tmpGroupDataArray = groupedData[propertyValue]

      if (!tmpGroupDataArray)
         tmpGroupDataArray = groupedData[propertyValue] = []

      workWithData(data)

      data.counter = counter.addCount(data.titleID, data.named_item_rarity)
      data.tr = createTr(data)

      tmpGroupDataArray.push(data)
   }
   editTable()

   let groups = Object.keys(groupedData)

   let resultingGroupedData = []

   for (let i = 0; i < groups.length; i++) {
      let gachaName = groupedData[groups[i]][0].gachaName
      let titleID = groupedData[groups[i]][0].titleID
      let math_data = {}

      let counter_title_id = counter.categoryCounter(titleID)
      resultingGroupedData.all_data = counter.addToAllData(counter_title_id)

      resultingGroupedData.push({
         gachaName: gachaName,
         titleID: titleID,
         data: groupedData[groups[i]],
         counters: counter_title_id,
         math_data: doMathPerCategory(groupedData[groups[i]].length, titleID)
      })

   }
   resultingGroupedData.math_data = doMathPerCategory()

   return resultingGroupedData
}



function addRarityCounter() {
   let counter = {}

   return {
      addCount(title, rarity) {

         if (!counter[title]) {
            counter[title] = {
               pity_counter: 0,
               title_counter: 0,
               type_counter: {},
            }
         }
         
         let type_counter = counter[title].type_counter
         if (!type_counter[rarity]) {
            type_counter[rarity] = 0;
         }

         counter[title].pity_counter++
         counter[title].title_counter++
         type_counter[rarity]++

         if (rarity == 'Legendary') {
            let temp = Object.assign({}, counter[title])
            counter[title].pity_counter = 0
            return temp
         }
         return Object.assign({}, counter[title])
      },

      addToAllData(obj){
         if(!counter.all_data){
            counter.all_data = {}
         }
         for(const rarity of Object.keys(obj.type_counter)){

            let link = obj.type_counter[rarity]

            if(!counter.all_data[rarity]){
               counter.all_data[rarity] = 0
            }
            if(!counter.all_data.all){
               counter.all_data.all = 0
            }
            counter.all_data[rarity] += link
            counter.all_data.all += link
         }
         return counter.all_data
      },

      categoryCounter(title) {
         return counter[title]
      },
      allCounter() {
         return counter.all_data
      },

   }
}

function doMathPerCategory(length='', category='') {
   let temp = {}
   let c
   if(length && category){
      c = counter.categoryCounter(category).type_counter
   }else{
      c = counter.allCounter()
      length = c.all
   }
   for (const rarity of Object.keys(c)) {
      let string = rarity + '_percentage'
      temp[string] = (c[rarity] / length * 100).toFixed(2)
   }
   return temp
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
      return ['001', '005', '006', '008', '012',
              '013', '017', '021', '022', '030',
              '036', '038', '040', '041', '044',
              '051', '057', '058', '080', '092',
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
let group = groupDataByProperty(histories, 'gachaName')
console.log(group)
getTime.time('End of for_loop:')