call echo installing pagination
call timeout 5
call npm install ngx-pagination

call echo installing bootstrap and jquery
call timeout 5
call npm install bootstrap jquery

call echo installing angular web storage
call timeout 5
call npm install angular-web-storage

call echo Adding All Components in respective folders
call timeout 5
call ng g c common/header --inline-style --skip-tests
call ng g c common/footer --inline-style --skip-tests
call ng g c common/cart --inline-style --skip-tests
call ng g c common/home --inline-style --skip-tests



call ng g c user/notes --inline-style --skip-tests
call ng g c user/notes/note-detail --inline-style --skip-tests
call ng g c user/softwares --inline-style --skip-tests
call ng g c user/softwares/software-detail --inline-style --skip-tests
call ng g c user/orders --inline-style --skip-tests
call ng g c user/post-review --inline-style --skip-tests
call ng g c admin/admin-home --inline-style --skip-tests
call ng g c admin/admin-notes --inline-style --skip-tests
call ng g c admin/admin-softwares --inline-style --skip-tests
call ng g c admin/admin-orders --inline-style --skip-tests
call ng g c admin/admin-reviews --inline-style --skip-tests
call ng g c admin/admin-login --inline-style --skip-tests

call echo Adding All Services
call timeout 5
call ng g s core/services/note --skip-tests
call ng g s core/services/software --skip-tests
call ng g s core/services/cart --skip-tests
call ng g s core/services/order --skip-tests
call ng g s core/services/review --skip-tests
call ng g s core/services/auth --skip-tests
call ng g s core/services/api --skip-tests

call echo Adding All Models
call timeout 5
call ng g class core/models/note --skip-tests
call ng g class core/models/software --skip-tests
call ng g class core/models/cart-item --skip-tests
call ng g class core/models/order --skip-tests
call ng g class core/models/review --skip-tests
call ng g class core/models/user --skip-tests
