(defn resume-html
  []
  (hiccup/html5 {:language "en"}
    (head-html
      "Elio Capella Sánchez - Resume"
      "An updated summary of my work career")
    [:body
      (navigation-html :resume)
      (summary-html (:summary content/resume))
      (work-experience-html (:work-experience content/resume))
      (education-html (:education content/resume))]))
