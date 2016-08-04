(defn index-html
  []
  (hiccup/html5 {:language "en"}
    (head-html
      "Elio Capella Sánchez - Resume"
      "An updated summary of my work career")
    [:body
      (work-experience-html content/work-experience)
      (education-html content/education)]))
