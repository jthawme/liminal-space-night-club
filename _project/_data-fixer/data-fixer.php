<?php

$chrono_quiz_csv    = '_data/chrono-quiz.csv';
$feedback_csv       = '_data/feedback.csv';

//CHRONO

$chrono_quiz_data   = readCSV($chrono_quiz_csv);

$csv_headers = array_shift($chrono_quiz_data);

foreach($chrono_quiz_data as $key => $chrono_quiz_row) {

    //var_dump($chrono_quiz_row);

    $chrono_quiz_data[$key] = dataFixChronoQuiz($chrono_quiz_row);

    //var_dump($chrono_quiz_data[$key]);
    //die();
}

$chrono_quiz_output = array_merge([$csv_headers], $chrono_quiz_data);

$fp = fopen('_output/chrono_clinic_fixed.csv', 'w');

foreach ($chrono_quiz_output as $fields) {
    fputcsv($fp, $fields);
}

fclose($fp);

//FEEDBACK

$feedback_data   = readCSV($feedback_csv);

$csv_headers = array_shift($feedback_data);

foreach($feedback_data as $key => $feedback_row) {

    $feedback_data[$key] = dataFixFeedback($feedback_row);

}

$feedback_output = array_merge([$csv_headers], $feedback_data);

$fp = fopen('_output/feedback_fixed.csv', 'w');

foreach ($feedback_output as $fields) {
    fputcsv($fp, $fields);
}

fclose($fp);

//Write out the data

function dataFixChronoQuiz($row_data) {

    transposeOneToFour($row_data[6]);
    transposeOneToFour($row_data[7]);
    transposeOneToFour($row_data[9]);

    return $row_data;

}

function dataFixFeedback($row_data) {

    transposeOneToFive($row_data[2]);
    transposeOneToFive($row_data[3]);
    transposeOneToFive($row_data[4]);
    transposeOneToFive($row_data[5]);
    transposeOneToFive($row_data[6]);

    return $row_data;

}

function transposeOneToFour(&$data_item) {

    if(!empty($data_item)) {

        $tranpose_one_to_four = ['1' => '4', '2' => '3', '3' => '2', '4' => '1'];
        $data_item = $tranpose_one_to_four[$data_item];

    }

}

function transposeOneToFive(&$data_item) {

    if(!empty($data_item)) {

        $tranpose_one_to_five = ['1' => '5', '2' => '4', '3' => '3', '4' => '2', '5' => '1'];
        $data_item = $tranpose_one_to_five[$data_item];

    }

}

function readCSV($file){

    $fp = fopen($file, 'r');

    $csvArray = array();

    while ($row = fgetcsv($fp)) {
        $csvArray[] = $row;
    }

    fclose($fp);

    return $csvArray;

}
