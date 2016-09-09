
(defn- interesting-content-entry-html
  [interesting-content-entry]
  [:div.interesting-content-entry
    [:h2.interesting-content-title (:title interesting-content-entry)]])

(defn interesting-content-html
  []
  (hiccup/html5 {:language "en"}
    (head-html
      "Elio Capella Sánchez - Interesting content"
      "A list of books, articles, documentaries or whatever I find interesting")
    [:body
      (navigation-html :interesting-content)
      (into
        [:section [:h1 "Interesting content"]]
        (map interesting-content-entry-html content/interesting-content))]))
