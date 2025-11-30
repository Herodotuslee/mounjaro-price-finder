// src/components/PriceTable.js
import React from "react";
import {
  getCanonicalTypeCode,
  formatPrice,
  formatLastUpdated,
} from "../utils/priceHelpers";
import { DOSE_COLUMNS, COMMON_DOSES } from "../utils/doseConfig";
import { CITY_LABELS, TYPE_LABELS } from "../data/prices";
import { FaChevronUp, FaChevronDown, FaRegEdit } from "react-icons/fa";

function PriceTable({
  data,
  showAllDoses,
  expandedNoteId,
  setExpandedNoteId,
  onOpenReport,
}) {
  // Determine which dose columns should be displayed
  const activeDoseColumns = showAllDoses
    ? DOSE_COLUMNS
    : DOSE_COLUMNS.filter((d) => COMMON_DOSES.includes(d.label));

  const totalColumns = 4 + activeDoseColumns.length + 3;

  return (
    <section className="table-card">
      <div className="table-scroll">
        <table className="price-table">
          <thead>
            <tr>
              <th>城市</th>
              <th>地區</th>
              <th>類型</th>
              <th>名稱</th>

              {activeDoseColumns.map((dose) => (
                <th key={dose.key}>{dose.label}</th>
              ))}

              <th>備註</th>
              <th>更新日期</th>
              <th>協助更新</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => {
              const typeCode = getCanonicalTypeCode(item.type);
              const lastUpdatedText = formatLastUpdated(item.last_updated);
              const note = item.note || "-";
              const isExpanded = expandedNoteId === item.id;

              return (
                <tr key={`${item.id}-${index}-row`}>
                  <td>{CITY_LABELS[item.city] || item.city || "-"}</td>
                  <td>{item.district || "-"}</td>
                  <td>{TYPE_LABELS[typeCode] || "診所"}</td>
                  <td>{item.clinic}</td>

                  {activeDoseColumns.map((dose) => (
                    <td key={dose.key}>{formatPrice(item[dose.key]) || "-"}</td>
                  ))}

                  <td
                    className={`col-note ${
                      isExpanded ? "note-expanded" : "note-collapsed"
                    }`}
                  >
                    <div className="note-text">{note}</div>

                    {item.note && item.note.length > 30 && (
                      <button
                        type="button"
                        className="note-toggle"
                        onClick={() =>
                          setExpandedNoteId(isExpanded ? null : item.id)
                        }
                      >
                        {isExpanded ? (
                          <FaChevronUp className="note-icon" />
                        ) : (
                          <FaChevronDown className="note-icon" />
                        )}
                      </button>
                    )}
                  </td>

                  <td>
                    {lastUpdatedText && (
                      <span className="last-updated">{lastUpdatedText}</span>
                    )}
                  </td>

                  <td>
                    <FaRegEdit
                      className="report-icon-btn"
                      onClick={() => onOpenReport(item)}
                      title="編輯 / 協助更新此筆資料"
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={totalColumns}
                  style={{ textAlign: "center", padding: "12px" }}
                >
                  目前沒有符合條件的資料。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PriceTable;
