import React, { useState } from "react";
import config from "../config";
import IBroadcast from "../interface/IBroadcast";
import { useAuth } from "../AuthContext";
import styles from "../styles/broadcastedit.module.css";
import { useOutletContext } from "react-router-dom";

interface LayoutContext {
  stationData: IBroadcast;
}

const BroadcastStationEdit: React.FC<{
  updateStationData: any;
  handleCancel: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  updateStationData,
  handleCancel,
  setIsEditing

}) => {
  const { stationData }: LayoutContext = useOutletContext() || { stationData: {} as IBroadcast };

  const [editedStation, setEditedStation] = useState(stationData.station_name || '');
  const [editedBaseLocation, setEditedBaseLocation] = useState(stationData.base_location || '');
  const [editedAssociationChapter, setEditedAssociationChapter] = useState(
    stationData.association_chapter
   || '');
  const [editedYearStarted, setEditedYearStarted] = useState(stationData.year_started || '');
  const [editedRadioShows, setEditedRadioShows] = useState<string[]>(stationData?.radio_shows || []);

  const { accessToken } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (
    setter: (value: string ) => void,
    key: string,
    value: string
  ) => {
    setter(value);
    updateStationData({ ...stationData, [key]: value });
  };
  

  const handleRadioShowChange = (index: number, value: string) => {
    const updatedRadioShows = [...editedRadioShows];
    updatedRadioShows[index] = value;
    setEditedRadioShows(updatedRadioShows);
    updateStationData({ ...stationData, radio_shows: updatedRadioShows });
  };

  const addRadioShowField = () => {
    setEditedRadioShows([...editedRadioShows, ""]);
  };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setIsSaving(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/station`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ stationData }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setIsSaved(true);
        setIsSaving(false);
        setTimeout(() => {
          setIsEditing(false);
        }, 2000);
      }else{
        console.error("Error saving broadcast data:", data.error);
      }
    } catch (error) {
      console.error("Error saving broadcast data:", error);
      alert("Failed to save broadcast data.");
    }    
};
 


  return (
    <form onSubmit={handleSubmit}>
    <div className={styles.containeredit}>
      {/* <h1>Edit Broadcast Station</h1> */}
      <div className={styles.groupedit}>
        <label>Station Name:</label>
        <input
          type="text"
          value={editedStation}
          onChange={(e) => handleInputChange(setEditedStation, "station_name", e.target.value)}
        />
      </div>
      <div className={styles.groupedit}>
        <label>Base Location:</label>
        <input
          type="text"
          value={editedBaseLocation}
          onChange={(e) => handleInputChange(setEditedBaseLocation, "base_location", e.target.value)}
        />
      </div>
      <div className={styles.groupedit}>
        <label>Association Chapter:</label>
        <input
          type="text"
          value={editedAssociationChapter}
          onChange={(e) => handleInputChange(setEditedAssociationChapter, "association_chapter", e.target.value)}
        />
      </div>
      <div className={styles.groupedit}>
        <label>Year Started:</label>
        <input
          type="text"
          value={editedYearStarted}
          onChange={(e) => handleInputChange(setEditedYearStarted, "year_started", e.target.value)}
        />
      </div>
      <div className={styles.groupedit}>
        <label>Radio Shows:</label>
        {editedRadioShows.map((show, index) => (
          <div key={index}>
            <input className={styles.showrad}
              type="text"
              value={show}
              onChange={(e) => handleRadioShowChange(index, e.target.value)}
            />
          </div>
        ))}
        <button className={styles.showrad} type="button" onClick={addRadioShowField}>
          Add Radio Show
        </button>
      </div>
      <div className={styles.editbtn}>
      <button  type="submit" disabled={isSaved}>
          {isSaving ? "Saving Station data..." : "Save"}
        </button>
        <button className={styles.editbtn} type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
        {isSaved && (
          <p className={styles.sucessedit} style={{ color: "green" }}>Saved data successfully</p>
        )}
      
    </div>
    </form>
  );
};

export default BroadcastStationEdit;
