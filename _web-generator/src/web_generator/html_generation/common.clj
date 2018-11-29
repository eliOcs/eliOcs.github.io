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
    [:link {:href "/favicon.ico" :rel "icon"}]
    (hiccup/include-css "css/normalize.css")
    (hiccup/include-css "css/main.css")])

(def ^:private format-date
  (let [european-date-format (time-format/formatter "d/M/YYYY")]
    (fn [date] (time-format/unparse-local-date european-date-format date))))

(def footer-html
  [:footer [:p (str "Last website update on " (format-date (time/today)))]])

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

(defn create-image-thumbnail
  [height width image]
  (let [root "../"
        image-path (str root image)
        thumbnail (clojure.string/replace image #"^images" "thumbnails")
        thumbnail-path (str root thumbnail)]
    (if-not (fs/exists? thumbnail-path)
      (do
        (fs/mkdirs (fs/parent thumbnail-path))
        (sh/with-programs [convert]
          (convert
            image-path
            "-thumbnail" (str width "x" height "^")
            "-gravity" "Center"
            "-crop" (str width "x" height "+0+0")
            "+repage"
            thumbnail-path))))
    thumbnail))

(def section-links
  {:home "index.html"
   :resume "resume.html"
   :interesting-content "interesting-content.html"
   :contact "mailto:me@eliocapella.com"})

(defn navigation-html
  [active-section]
  [:header
    [:img {:src "images/logo.svg"}]
    [:nav
      (set-active-section
        {:home [:a {:href (:home section-links)} "Home"]
         :resume [:a {:href (:resume section-links)} "Resume"]
         :interesting-content [:a {:href (:interesting-content section-links)} "Interesting content"]
         :contact [:a {:href (:contact section-links)} "Contact"]}
        active-section)]])
