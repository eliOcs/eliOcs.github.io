(defn index-html
  []
  (hiccup/html5 {:language "en"}
    (head-html
      "Elio Capella Sánchez"
      "My personal web page. Find more about me and what I'm currently doing.")
    [:body
      (summary-html (:summary content/resume))
      (work-experience-html (:work-experience content/resume))
      (education-html (:education content/resume))]))
