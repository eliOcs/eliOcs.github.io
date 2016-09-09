(defn escape-multiline-text
  [string]
  (loop [[first-line & rest] (clojure.string/split string #"\n") result []]
    (if (empty? rest)
      (conj result first-line)
      (recur rest (conj result first-line [:br])))))

(defn head-html
  [title description]
  [:head
    [:meta {:charset "utf8"}]
    [:meta {:http-equiv "x-ua-compatible" :content "ie=edge"}]
    [:meta {:name "viewport" :content "width=device-width, initial-scale=1"}]
    [:title title]
    [:meta {:name "description" :content description}]
    (hiccup/include-css "css/normalize.css")
    (hiccup/include-css "css/main.css")])

(defn- add-active-class-to-section-link
  [section-link]
  (assoc section-link 1 (into (get section-link 1) {:class "active"})))

(defn- add-active-class-to-section-link-if-necessary
  [[section-name section-link] active-section]
  (if (= section-name active-section)
    (add-active-class-to-section-link section-link)
    section-link))

(defn- set-active-section
  [section-links active-section]
  (map #(add-active-class-to-section-link-if-necessary % active-section) section-links))

(defn navigation-html
  [active-section]
  [:header
    [:img {:src "images/logo.svg"}]
    [:nav
      (set-active-section
        {:home [:a {:href "/"} "Home"]
         :resume [:a {:href "/resume.html"} "Resume"]
         :interesting-content [:a {:href "/interesting-content.html"} "Interesting content"]
         :contact [:a {:href "/contact.html"} "Contact"]}
        active-section)]])
