(defn- education-entry-html
  [education-entry]
  [:div.education-entry
    [:h2.degree (:degree education-entry)]
    [:p.period (:period education-entry)]
    [:h3.school (:school education-entry)]
    [:p.experience (:description education-entry)]])

(defn education-html
  [education]
  (into
    [:section [:h1 "Education"]]
    (map education-entry-html education)))
