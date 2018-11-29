(defn- format-value
  [value unit]
  (str value " " unit (if (not= value 1) "s")))

(defn- days-in-period
  [{start :start end :end}]
  (time/in-days (time/interval start end)))

(defn- months-in-period
  [period]
  (->
    (days-in-period period)
    (/ 30)
    double
    Math/round))

(defn- format-period-length
  [period]
  (let [months-in-period (months-in-period period)
        years (quot months-in-period 12)
        months (rem months-in-period 12)]
    (str
      (if (> years 0)
          (str
            (format-value years "year")
            (if (> months 0) " and ")))
      (format-value months "month"))))

(def ^:private format-period-date
  (let [month-year-format (time-format/formatter "MMMM yyyy")]
    (fn [date] (time-format/unparse month-year-format date))))

(defn parse-period
  [{start :start end :end}]
  {:start (parse-date start) :end (parse-date end)})

(defn- format-period
  [period-string]
  (let [period (parse-period period-string)]
    (str
      (format-period-date (:start period))
      " - "
      (format-period-date (:end period))
      ", "
      (format-period-length period))))

(defn- company-html
  [{name :name description :description}]
  (into
    [:p.company-description [:span.company-name name]]
    (escape-multiline-text (str ". " description))))

(defn- experience-description-html
  [description]
  (into [:p.experience] (escape-multiline-text description)))

(defn- tools-html
  [tools]
  (into
    [:p.tools [:b "Tools used:"]]
    (map #(vector :span.tool %) tools)))

(defn- image-html
  [image]
  [:a
   {:href image :target "_blank"}
   [:img {:src (create-image-thumbnail 100 100 image)}]])

(defn- images-html
  [images]
  (if-not (nil? images)
    [:div.images
      (map image-html images)]))

(defn- experience-entry-html
  [{title :title description :description images :images tools :tools}]
  [(if-not (nil? title)
    [:h3.experience-title title])
   (experience-description-html description)
   (images-html images)
   (tools-html tools)])

(defn- experience-html
  [experience]
  (if (sequential? experience)
    (apply concat (map experience-entry-html experience))
    (experience-entry-html experience)))

(defn- work-experience-entry-html
  [work-experience-entry]
  (into
    [:div.job-entry
      [:h2.job-title (:job-title work-experience-entry)]
      [:p.period (format-period (:period work-experience-entry))]
      (company-html (:company work-experience-entry))]
    (experience-html (:experience work-experience-entry))))

(defn work-experience-html
  [work-experience]
  (into
    [:section [:h1 "Experience"]]
    (map work-experience-entry-html work-experience)))
