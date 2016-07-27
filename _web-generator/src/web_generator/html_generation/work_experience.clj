(def ^:private format-period-date
  (let [month-year-format (time-format/formatter "MMMM yyyy")]
    (fn [date] (time-format/unparse month-year-format date))))

(defn- days-in-period
  [{start :start end :end}]
  (time/in-days (time/interval start end)))

(defn- months-in-period
  [period]
  (int (/ (days-in-period period) 30)))

(defn- format-period-length
  [period]
  (let [months (months-in-period period)]
    (str months " month" (if (not= months 1) "s"))))

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

(defn- experience-item-html
  [{description :description tools :tools}]
  [(experience-description-html description)
   (tools-html tools)])

(defn- experience-html
  [experience]
  (apply concat (map experience-item-html experience)))

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
