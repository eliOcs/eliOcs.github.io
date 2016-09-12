
(defn interesting-content-entry-html
  [interesting-content-entry]
  [:a.interesting-content-entry {:href (interesting-content-entry :url)
                                 :target "_blank"}
    [:h2.title (:title interesting-content-entry)]
    (if (contains? interesting-content-entry :author)
      [:p.author (:author interesting-content-entry)])
    [:p.type (:type interesting-content-entry)]
    [:p.comment (:comment interesting-content-entry)]
    [:p.tags (map #(vector :span.tag %) (:tags interesting-content-entry))]
    [:p.added (str "Added on " (:added interesting-content-entry))]])


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
        (map interesting-content-entry-html content/interesting-content))
      footer-html]))
