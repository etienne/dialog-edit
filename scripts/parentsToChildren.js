const fs = require('fs');

const storeString = fs.readFileSync('./data/store.json').toString();
const store = JSON.parse(storeString);

console.log('🎒 Backing up store to data/store-parentsToChild-backup.json');
fs.writeFileSync('./data/store-parentsToChild-backup.json', storeString);
const nodes = store.nodes;
let pairs = [];
let updatedNodes = {...nodes};
let branches = store.branches || {};
let branchId = 1;

Object.keys(nodes).map((id) => {
  const node = nodes[id];
  if (node.parent) {
    if (Array.isArray(node.parent)) {
      node.parent.forEach((parentId) => {
        pairs.push({
          parent: Number(parentId),
          child: node.id,
        });
      });
    } else {
      pairs.push({
        parent: Number(node.parent),
        child: node.id,
      });
    }
    delete updatedNodes[id].parent;
  }

  if (node.label) {
    branches[branchId] = { id: branchId, label: node.label, firstNode: node.id };
    delete updatedNodes[id].label;
    branchId++;
  }
});

console.log('🔄 Converting parents to children 🤔');
pairs.forEach((pair) => {
  if (!updatedNodes[pair.parent]) {
    console.error('⚠️  Missing parent: ' + pair.parent);
  } else {
    if (!Array.isArray(updatedNodes[pair.parent].children)) {
      updatedNodes[pair.parent].children = [];
    }
    updatedNodes[pair.parent].children.push(pair.child);
  }
});
store.nodes = updatedNodes;

console.log('🌲 Converting labels to branches');
store.branches = branches;

console.log('✏️  Writing updated store file');
fs.writeFileSync('./data/store.json', JSON.stringify(store));

console.log('✅ Done!');
