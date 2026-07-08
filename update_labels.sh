for file in frontend/src/pages/admin/AdminMapiPage.jsx frontend/src/pages/admin/AdminBantwaraPage.jsx frontend/src/pages/admin/AdminMapRequestsPage.jsx frontend/src/pages/admin/AdminToolsOrdersPage.jsx; do
  sed -i '' "s/assigned: 'Assigned'/assigned: 'Assigned', withdrawn: 'Withdrawn'/" "$file"
  sed -i '' "s/assigned: 'badge-yellow'/assigned: 'badge-yellow', withdrawn: 'badge-red'/" "$file"
done
