# How to run the Project

1. Install the dependencies by running `yarn`
2. Run the code using `SUPABASE_URL="" SUPABASE_ANON_KEY="" yarn dev` (or using make, if you're using 1Password)

# Things I'd like to add:

## Important things left to do:

-   Lay out the global nodes on the left of the main node tree
-   Add a dynamic breadcrumb for easier navigation
-   Supabase doesn't support transactions, so collaboration could probably cause issues in some instance (anyway, there's no listener setup so collaboration won't work)

#### Collaboration

-   This should ideally work with stateless servers at edge, that can merge the changes in real-time and only save to database once, when the session ends (to improve latency, handle higher load, etc)
-   Websockets could further improve things by only sharing what changed to the clients, without sending the whole node tree, this &&**would also have a big effect on the client-side performance** and the real-time feel

## UX Related

-   Add some validation for the function_name
    It's not clear for the user that the function names should be dashed
-   Add a loader while React Suspense fetched the Editor bundle
-   Add navigation blocking when changes are syncing
    Just to make sure all the changes are save
-   Add keyboard hotkeys for navigation, in 4 directions
-   Add some tooltips when hovering over the extracted data fields

## Design Related

-   Improve the visuals for the data extraction panel (in the sidebar)

## Logic Related

-   Remove edges from database, a parent attribute is enough to build the tree

## Refactoring

-   I would bind the logic directly to the types generated by Supabase
-   I would split the AgentEditorStore into separate logic-related objects
-   I would move the `DataExtractionPanel` code to the editor store
-   Refactor `Colors` object into `Guidelines`, as it now includes other presets

## Database Related

-   There seems to be an issue with the `updated_at` column. Supa returns `400` even when it's in the exact same format as the `created_at`
