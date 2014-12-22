require './resources/libs'
require './locales/locales'
require '../shared/routes/routes'
require '../shared/routes/api'
require './resources/tasty'
require './react/application'

# /*==========  Services  ==========*/

require '../shared/react/services/thumbor'

# /*==========  Components  ==========*/

require './react/components/toolbars/user'
require './react/components/toolbars/feed'

# /*==========  Pages  ==========*/

require './react/pages/entry'

# /*==========  Stores  ==========*/

require './react/stores/current_user'
require './react/stores/relationships'