
function getColorClass(idx) {
  switch (idx % 4) {
    case 0: return 'is-info';
    case 1: return 'is-success';
    case 2: return 'is-warning';
    default:
      return 'is-danger'
  }
}

function accountTile(account, idx = 0) {
  const colorClass = getColorClass(idx)

  return `
    <div style="margin: 1em" class="card notification ${colorClass}">
      <div class="card-content">
        <p class="title">${account.name}</p>
        <p class="subtitle is-5">${account.nickname}</p>
        <p class="title is-6"><b>${account.balance}</b> available</p>
      </div>
      <footer class="card-footer">
        <p class="card-footer-item">
          <a id='selectAccount${account.id}'>Use this Account</a>
        </p>
      </footer>
    </div>
  `
}

export default {
  accountTile
}