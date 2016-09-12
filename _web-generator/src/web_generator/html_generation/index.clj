(defn index-html
  []
  (hiccup/html5 {:language "en"}
    (head-html
      "Elio Capella Sánchez"
      "My personal website. Find more about me and what I'm currently doing.")
    [:body
      (navigation-html :home)
      [:section.home-resume
        [:h1 "About my work"]
        [:p.summary (:summary content/resume)]
        [:a.continue-reading {:href (:resume section-links)} "Continue reading my resume"]]
      (conj
        (into
          [:section.home-interesting-content [:h1 "Content I've found interesting lately"]]
          (map interesting-content-entry-html (take 3 content/interesting-content)))
        [:a.continue-reading {:href (:interesting-content section-links)} "Check out the full list"])
      footer-html]))
