package com.fyp.waqasansari.doorlock;

import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.firebase.client.DataSnapshot;
import com.firebase.client.Firebase;
import com.firebase.client.FirebaseError;
import com.firebase.client.ValueEventListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;


public class MainActivity extends ActionBarActivity {
    String[] UsernameList;
    String[] PasswordList;
    String username, password, UserData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final EditText txtName = (EditText) findViewById(R.id.txtUserName);
        final EditText txtPassword = (EditText) findViewById(R.id.txtPassword);


        Firebase.setAndroidContext(this);
        Firebase myAccountReference = new Firebase("https://homeiot.firebaseio.com");
        myAccountReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                UserData = dataSnapshot.getValue().toString();
                Log.d("Data", UserData);
                try {
                    JSONObject object = new JSONObject(UserData);
                    UsernameList = new String[object.names().length()];
                    PasswordList = new String[object.names().length()];
                    for(int i=0; i <= object.names().length(); i++){
                        UsernameList[i] = object.names().getString(i);
                        PasswordList[i] = object.getJSONObject(object.names().getString(i)).getString("password");
                        Log.d("Name", UsernameList[i]);
                        Log.d("Password", PasswordList[i]);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onCancelled(FirebaseError firebaseError) {

            }
        });


        /*Firebase.setAndroidContext(this);

        Firebase myFirebaseRef = new Firebase("https://homeiot.firebaseio.com/furqan/lock/history");

        DateFormat dateFormatter = new SimpleDateFormat("yyyyMMddhhmmss");
        dateFormatter.setLenient(false);
        Date today = new Date();
        String s = dateFormatter.format(today);



        Map<String, String> unlock = new HashMap<String, String>();
        unlock.put("person", "Furqan");
        unlock.put("time", s);
        myFirebaseRef.push().setValue(unlock);*/

        Button btnSignIn = (Button) findViewById(R.id.btnSignIn);
        btnSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                username = txtName.getText().toString();
                password = txtPassword.getText().toString();
                if(TextUtils.isEmpty(username) ){
                    txtName.setError("Username Field cannot be empty.");
                    return;
                }
                if(TextUtils.isEmpty(password)) {
                    txtPassword.setError("Password Field cannot be empty.");
                    return;
                }
                final ProgressDialog ringProgressDialog = ProgressDialog.show(MainActivity.this, "Signing in.", "Please wait ...", true);

                for(int i=0; i <= UsernameList.length; i++){
                    Log.d(username, UsernameList[i]);
                    Log.d(password, PasswordList[i]);

                    if(username.equals(UsernameList[i]) && password.equals(PasswordList[i])) {
                        Intent intent = new Intent(MainActivity.this, LockDetail.class);
                        intent.putExtra("USERNAME", username);
                        ringProgressDialog.dismiss();
                        startActivity(intent);
                        break;
                    }
                    else {
                        if (i == (UsernameList.length - 1)) {
                            ringProgressDialog.dismiss();
                            Toast.makeText(getApplicationContext(), "Incorrect Username/Password", Toast.LENGTH_SHORT).show();
                            return;
                        }

                    }
                }
            }
        });



    }

    @Override 
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

}
