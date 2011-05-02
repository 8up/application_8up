require 'test_helper'

class PlacedAvatarsControllerTest < ActionController::TestCase
  setup do
    @placed_avatar = placed_avatars(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:placed_avatars)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create placed_avatar" do
    assert_difference('PlacedAvatar.count') do
      post :create, :placed_avatar => @placed_avatar.attributes
    end

    assert_redirected_to placed_avatar_path(assigns(:placed_avatar))
  end

  test "should show placed_avatar" do
    get :show, :id => @placed_avatar.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @placed_avatar.to_param
    assert_response :success
  end

  test "should update placed_avatar" do
    put :update, :id => @placed_avatar.to_param, :placed_avatar => @placed_avatar.attributes
    assert_redirected_to placed_avatar_path(assigns(:placed_avatar))
  end

  test "should destroy placed_avatar" do
    assert_difference('PlacedAvatar.count', -1) do
      delete :destroy, :id => @placed_avatar.to_param
    end

    assert_redirected_to placed_avatars_path
  end
end
