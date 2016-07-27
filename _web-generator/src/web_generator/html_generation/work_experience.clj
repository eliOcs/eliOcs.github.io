(defn- format-value
  [value unit]
  (str value " " unit (if (not= value 1) "s")))

(defn- days-in-period
  [{start :start end :end}]
  (time/in-days (time/interval start end)))

(defn- months-in-period
  [period]
  (int (Math/ceil (/ (days-in-period period) 30))))

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

(defn- format-period
  [{start :start end :end :as period}]
  (str
    (format-period-date start)
    " - "
    (format-period-date end)
    ", "
    (format-period-length period)))

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

(defn- experience-with-no-title-html
  [{description :description tools :tools}]
  [(experience-description-html description)
   (tools-html tools)])

(defn- experience-with-title-html
  [{title :title description :description tools :tools}]
  [[:h3.experience-title title]
   (experience-description-html description)
   (tools-html tools)])

(defn- experience-html
  [experience]
  (if (vector? experience)
    (apply concat (map experience-with-title-html experience))
    (experience-with-no-title-html experience)))

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
  [:section (map work-experience-entry-html work-experience)])
