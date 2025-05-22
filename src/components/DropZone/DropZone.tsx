import React, { useEffect, useState } from 'react';
import mlImages from '../../data/ml.json';
import ssrImages from '../../data/ssr.json';
import srImages from '../../data/sr.json';
import rImages from '../../data/r.json';
import "./DropZone.css"

type ItemType = {
  name: string;
  image_path: string;
  type: TypePersoFilter;
};

type TierItem = {
  name: string;
  color: string
}

const tiers: TierItem[] = [
  {
    name: "S",
    color: "red"
  },
  {
    name: "A",
    color: "orange"
  },
  {
    name: "B",
    color: "yellow"
  },
  {
    name: "C",
    color: "green"
  }
];

enum TypePersoFilter {
  R,
  SR,
  SSR,
  ML,
  SSR_RGB,
  ALL
}

type displayItem = {
  type: TypePersoFilter,
  name: string
}

const DragDropJSON: React.FC = () => {
  const [droppedItems, setDroppedItems] = useState<Map<string, ItemType[]>>(new Map());
  const [inputValue, setInputValue] = useState("");
  const [draggableItems, setDraggableItems] = useState<ItemType[]>([])
  const [displayMode, setDisplayMode] = useState<displayItem>({type: TypePersoFilter.ALL, name: "Tous"})
  const [open, setOpen] = useState(false);

  const displayTypeList: displayItem[] = [
    {type: TypePersoFilter.ALL, name: "All"},
    {type: TypePersoFilter.SSR, name: "SSR"},
    {type: TypePersoFilter.ML, name: "ML"},
    {type: TypePersoFilter.SSR_RGB, name: "SSR_RGB"},
    {type: TypePersoFilter.SR, name: "SR"},
    {type: TypePersoFilter.R, name: "R"},
  ]

  const handleSelect = (option: displayItem) => {
    setDisplayMode(option);
    setOpen(false);
  };

  useEffect(() => {
    setupMapItem()
    setUpDragableItem()
  }, [])

  const setupMapItem = () => {
    // ⚠️ Ne pas modifier l'ancienne Map directement
    const newMap = new Map(droppedItems);
    tiers.forEach(tier => newMap.set(tier.name, []))
    setDroppedItems(newMap);
  };

  const setUpDragableItem = () => {
    const arrayCharacter: ItemType[] = [];
    mlImages.forEach(item => arrayCharacter.push({name: item.title, image_path: `/characters/ml/${item.filename}`, type: TypePersoFilter.ML}))
    ssrImages.forEach(item => arrayCharacter.push({name: item.title, image_path: `/characters/ssr/${item.filename}`, type: TypePersoFilter.SSR_RGB}))
    srImages.forEach(item => arrayCharacter.push({name: item.title, image_path: `/characters/sr/${item.filename}`, type: TypePersoFilter.SR}))
    rImages.forEach(item => arrayCharacter.push({name: item.title, image_path: `/characters/r/${item.filename}`, type: TypePersoFilter.R}))

    setDraggableItems(arrayCharacter);
  }

  const addMapItem = (key: string, item: ItemType) => {
    const newMap = new Map(droppedItems);

    Array.from(newMap.entries()).forEach(([mapKey, itemList]) => {
      const filteredList = itemList.filter(i => i.name !== item.name);
      newMap.set(mapKey, filteredList);
    });
    
    const cpyDragable = draggableItems.filter(i => i.name !== item.name);
    setDraggableItems(cpyDragable);
    const table = newMap.get(key);

    if (table) {
      table.push(item);
      newMap.set(key, table);
      setDroppedItems(newMap);
    } 
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ItemType) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, key: string) => {
    e.preventDefault();
    const json = e.dataTransfer.getData('application/json');
    try {
      const item: ItemType = JSON.parse(json);
      addMapItem(key, item);
    } catch (err) {
      console.error('Invalid JSON dropped');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const filterList = (draggableItems: ItemType[]) => {
    switch (displayMode.type) {
      case TypePersoFilter.ALL:
        return draggableItems;
      case TypePersoFilter.SSR:
        return draggableItems.filter(item => (item.type === TypePersoFilter.ML || item.type === TypePersoFilter.SSR_RGB));
      default:
        return draggableItems.filter(item => item.type === displayMode.type)
    }
  }

  const tier = (item: TierItem) => {
    return <div
    onDrop={(e) => handleDrop(e, item.name)}
    onDragOver={handleDragOver}
    className="drop-zone"
  >
      <div className={`tier-container`} style={{ backgroundColor: `${item.color}`}}>
        <div className='tier-name'>{item.name}</div>
        {droppedItems.get(item.name)?.map((item, index) => (
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            key={index}
            className="item-charcater tab"
          >
            <img src={item.image_path} alt={item.name} className="image-character" />
          </div>
        ))}
      </div>
  </div>
  } 
  const classPerso = (type: TypePersoFilter) => {
    console.log("type => ", type)
    switch (type) {
      case TypePersoFilter.R:
        return "lightblue";
      case TypePersoFilter.SR:
        return "violet";
      case TypePersoFilter.SSR_RGB:
        return "yellow"
      default:
        return "dark"
    }
  }

  return (
    <div className="container">
      <button className={"clear-button"} onClick={() => {
        setupMapItem()
        setUpDragableItem()
        }}>Clear</button>
      {tiers.map(nameTier => tier(nameTier))}

      <div className="relative inline-block text-left">
        <button
          onClick={() => setOpen(!open)}
          className="button-dropdown"
        >
          {displayMode.name} ▼
        </button>

        {open && (
          <div className="container-option-list">
              {displayTypeList.map((option) => (
                <p
                  key={option.name}
                  onClick={() => handleSelect(option)}
                  className="option"
                >
                  {option.name}
                </p>
              ))}
          </div>
        )}
      </div>
      <div className="container-list-item">
        {filterList(draggableItems).map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className={`item-charcater ${classPerso(item.type)}`}
          >
            <img src={item.image_path} alt={item.name} className="image-character" />
            <span className="text-character text-sm text-center">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragDropJSON;
